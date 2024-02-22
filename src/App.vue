<template>
  <div class="main">
    <div class="text-center">
      <h1 class="title">
        Tic Tac Toe
      </h1>
      <Transition
        name="slide-left"
        mode="out-in">
        <h2
          :key="player"
          class="text-xl">
          Player {{ player }}'s turn!
        </h2>
      </Transition>
    </div>
    <div
      class="board"
      :class="{ 'board--game-over': isGameOver }"
      :style="{ '--player': `'${player}'` }">
      <template
        v-for="(box, i) of boards"
        :key="i">
        <div
          class="box"
          :data-box="box"
          @click="setMark(i)">
          {{ box }}
        </div>
      </template>
    </div>
  </div>
  <r-modal
    title="Game Over"
    :model-value="isGameOver"
    no-close
    no-backdrop-close>
    <div class="flex flex-col items-center space-y-4">
      <div class="py-4 text-4xl">
        {{ winner ? `${winner} Win` : 'Draw' }}
      </div>
      <div class="space-x-4">
        <r-button
          @click="reset()">
          New Game
        </r-button>
        <r-button
          @click="selectMode()">
          Settings
        </r-button>
      </div>
    </div>
  </r-modal>
  <r-modal
    v-model="modalMode"
    title="Select Mode"
    no-close
    no-backdrop-close>
    <div class="pt-4 space-x-4">
      <r-button
        @click="setMode(1)">
        1 Player
      </r-button>
      <r-button
        @click="setMode(2)">
        2 Players
      </r-button>
    </div>
  </r-modal>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  nextTick,
} from 'vue'
import {
  checkBoardFull,
  checkWinner,
  findBestMove,
  findLastMove,
  findOpponent,
  PLAYERS,
} from './game'
import rButton from './components/Button.vue'
import rModal from './components/Modal.vue'

const boards = ref<string[]>(Array.from<string>({ length: 9 }).fill(''))
const player = ref<string>(PLAYERS[0])
const mode   = ref(1)

const modalMode = ref(false)

const winner = computed(() => {
  return checkWinner(boards.value)
})

const isGameOver = computed(() => {
  return Boolean(winner.value || checkBoardFull(boards.value))
})

function reset () {
  boards.value = Array.from<string>({ length: 9 }).fill('')
  player.value = PLAYERS[0]
}

function setMark (index: number) {
  if (!isGameOver.value && boards.value[index] === '') {
    boards.value[index] = player.value

    nextTick(() => {
      nextPlayer()
    })
  }
}

function setMode (mode_: number) {
  mode.value      = mode_
  modalMode.value = false
}

function selectMode () {
  modalMode.value = true

  reset()
}

function nextPlayer () {
  player.value = findOpponent(player.value)

  const boards_  = [...boards.value]
  const lastMove = findLastMove(boards_)

  if (lastMove !== undefined)
    setMark(lastMove)

  if (mode.value === 1 && player.value === PLAYERS[1])
    setMark(findBestMove(boards_, player.value))
}

onMounted(() => {
  selectMode()
})
</script>

<style lang="postcss">
.main {
  @apply flex flex-col items-center pt-16 h-full min-h-screen bg-retro-500 font-body text-retro-800 space-y-4;
}

.title {
  @apply mb-6 text-5xl;
}

.board {
  @apply grid grid-cols-3 grid-rows-3 w-96 aspect-square p-4 border-2 border-retro-800;
}

.box {
  @apply w-full h-full border border-retro-800 flex items-center justify-center text-8xl cursor-not-allowed leading-none;

  &:nth-child(-n+3) {
    @apply border-t-0;
  }

  &:nth-child(3n) {
    @apply border-r-0;
  }

  &:nth-last-child(3n) {
    @apply border-l-0;
  }

  &:nth-last-child(-n+3) {
    @apply border-b-0;
  }

  &[data-box=""] {
    @apply cursor-pointer;

    .board:not(.board--game-over) &:hover::before {
      @apply content-[var(--player)] text-retro-800/30;
    }
  }
}
</style>
