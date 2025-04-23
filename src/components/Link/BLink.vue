<template>
  <a
      class="blink-link"
      :class="classes"
      href="#"
  >
        <span class="blink-text">
            <!-- @slot Displays the blinking text -->
            <slot />
        </span>
  </a>
</template>

<script lang="ts">
import useActive, {activeProps} from '@/composables/useActive';
import useDisabled, {disabledProps} from '@/composables/useDisabled';
import {computed} from 'vue';
import useClasses from '@/composables/useClasses';
</script>

<script lang="ts" setup>
const props = defineProps({
  ...activeProps,
  ...disabledProps,
});

const {classes} = useClasses(computed(() => [
  useActive(props.active).activeClass.value,
  useDisabled(props.disabled).disabledClass.value,
]));
</script>

<style scoped>
.blink-text {
  animation: blink-animation 1s steps(2, start) infinite;
}

@keyframes blink-animation {
  50% {
    opacity: 0;
  }
}
</style>
