<template>
  <img
      :src="src"
      :alt="alt"
      :class="[
      { 'img-fluid': fluid },
      { 'img-thumbnail': thumbnail },
      roundedClass
    ]"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  fluid: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: [Boolean, String],
    default: false,
  },
  thumbnail: {
    type: Boolean,
    default: false,
  },
});

const roundedClass = computed(() => {
  if (typeof props.rounded === 'string') {
    return `rounded-${props.rounded}`;
  }
  return props.rounded ? 'rounded' : '';
});
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
