<template>
  <div ref="popover">
    <slot />
    <PopoverContent>
      <slot name="content"></slot>
    </PopoverContent>
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
const contentEl = ref<HTMLElement | null>(null)
const isShowPop = ref(false)

const placement = computed(() => props.placement || 'top')
const trigger = computed(() => props.trigger || 'top')

let hideTimer: ReturnType<typeof window.setTimeout> | null = null

const clearHideTimer = () => {
  if (hideTimer !== null) {
    window.clearTimeout(hideTimer)
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

const handleDocumentClick = (event: MouseEvent) => {
  if (props.trigger !== 'click') return
  const target = event.target as Node | null
  console.log(target); // todo 不足：注册了几个组件就触发了几次，待优化
  const trigger = triggerEl.value
  const content = contentEl.value
  if (!target || !trigger) return
  if (trigger.contains(target)) return
  if (content?.contains(target)) return
  isShowPop.value = false
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
  if (props.trigger === 'click') {
    document.addEventListener('click', handleDocumentClick, true)
  }
})

onUnmounted(() => {
  unregisterTriggerEvent()
  clearHideTimer()
  if (props.trigger === 'click') {
    document.removeEventListener('click', handleDocumentClick, true)
  }
})

provide('isShowPop', isShowPop)
provide('placement', placement)
provide('trigger', trigger)
provide('triggerEl', triggerEl)
provide('contentEl', contentEl)
provide('onContentMouseEnter', handleContentMouseEnter)
provide('onContentMouseLeave', handleContentMouseLeave)
</script>

<style scoped>
.ufi-popover {
}
</style>
