<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  disabled?: boolean
  round?: boolean
  plain?: boolean
  loading?: boolean
}>(), {
  type: 'default',
  disabled: false,
  round: false,
  plain: false,
  loading: false
})

const classes = computed(() => [
  'ufi-button',
  `ufi-button--${props.type}`,
  { 'is-plain': props.plain, 'is-round': props.round, 'is-loading': props.loading, 'is-disabled': props.disabled }
])
</script>

<template>
  <button class="ufi-button" :class="classes" :disabled="disabled || loading">
    <span v-if="loading" class="ufi-button__spinner" aria-hidden="true"></span>
    <span class="ufi-button__content"><slot /></span>
  </button>
</template>
