<template>
  <Teleport to="body">
    <Transition
      name="slide-up"
      mode="out-in">
      <div
        v-if="isShow"
        class="modal">
        <div
          class="modal__container">
          <div class="modal__header">
            <div class="modal__title">
              <slot name="title">
                {{ title }}
              </slot>
            </div>
            <button
              v-if="!noClose"
              class="modal__close"
              @click="close()">
              ✕
            </button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
    <Transition
      name="fade"
      mode="out-in">
      <div
        v-if="isShow"
        class="modal__overlay"
        @click="onBackdropClicked()" />
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type   : String,
    default: '',
  },
  noClose: {
    type   : Boolean,
    default: false,
  },
  noBackdropClose: {
    type   : Boolean,
    default: false,
  },
})

const isShow = defineModel<boolean>({ default: true })

function close () {
  isShow.value = false
}

function onBackdropClicked () {
  if (!props.noBackdropClose)
    close()
}
</script>

<style lang="postcss">
.modal {
  @apply fixed top-0 left-0 w-screen h-full min-h-screen flex justify-center items-center z-50;

  &__container {
    @apply relative bg-retro-500 border-2 border-retro-800 min-w-52 z-[2];
  }

  &__header {
    @apply flex justify-between pt-4 px-4;
  }

  &__body {
    @apply px-4 pb-4;
  }

  &__close {
    @apply shrink-0 hover:opacity-50;
  }

  &__overlay {
    @apply absolute inset-0 w-full h-full bg-black/50 z-[1];
  }
}
</style>
