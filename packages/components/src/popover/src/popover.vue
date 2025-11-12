<template>
  <div ref="popover">
    <slot />
    <PopoverContent />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, useTemplateRef } from 'vue'
import PopoverContent from './popover-content.vue'
import { PopoverProps } from './popover'

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: 'hover',
  placement: 'bottom',
})

const popoverWrapRef = useTemplateRef('popover')
const triggerEl = ref<HTMLElement | null>(null)
const isShowPop = ref(false)
const placement = computed(() => props.placement || 'top')

let hideTimer: ReturnType<typeof setTimeout> | null = null

const clearHideTimer = () => {
  if (hideTimer !== null) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const showPopover = () => {
  clearHideTimer()
  isShowPop.value = true
}

const hidePopoverWithDelay = () => {
  clearHideTimer()
  hideTimer = window.setTimeout(() => {
    isShowPop.value = false
    hideTimer = null
  }, 150)
}

const handleTriggerMouseEnter = () => {
  if (props.trigger !== 'hover') return
  showPopover()
}

const handleTriggerMouseLeave = () => {
  if (props.trigger !== 'hover') return
  hidePopoverWithDelay()
}

const handleTriggerClick = () => {
  if (props.trigger !== 'click') return
  clearHideTimer()
  isShowPop.value = !isShowPop.value
}

const handleContentMouseEnter = () => {
  if (props.trigger !== 'hover') return
  showPopover()
}

const handleContentMouseLeave = () => {
  if (props.trigger !== 'hover') return
  hidePopoverWithDelay()
}

const registerTriggerEvent = () => {
  if (!triggerEl.value) return
  triggerEl.value.addEventListener('mouseenter', handleTriggerMouseEnter)
  triggerEl.value.addEventListener('mouseleave', handleTriggerMouseLeave)
  triggerEl.value.addEventListener('click', handleTriggerClick)
}

const unregisterTriggerEvent = () => {
  if (!triggerEl.value) return
  triggerEl.value.removeEventListener('mouseenter', handleTriggerMouseEnter)
  triggerEl.value.removeEventListener('mouseleave', handleTriggerMouseLeave)
  triggerEl.value.removeEventListener('click', handleTriggerClick)
}

onMounted(() => {
  triggerEl.value = popoverWrapRef.value?.firstElementChild as HTMLElement | null
  registerTriggerEvent()
})

onUnmounted(() => {
  unregisterTriggerEvent()
  clearHideTimer()
})

provide('isShowPop', isShowPop)
provide('placement', placement)
provide('triggerEl', triggerEl)
provide('onContentMouseEnter', handleContentMouseEnter)
provide('onContentMouseLeave', handleContentMouseLeave)
</script>

<style scoped>
.ufi-popover {
}
</style>
