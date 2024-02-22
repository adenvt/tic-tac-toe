<template>
  <button class="button">
    <slot />
  </button>
</template>

<style lang="postcss">
.button {
  @apply px-4 py-1 border-2 border-retro-800 hover:bg-retro-800 hover:text-retro-500;
}
</style>
