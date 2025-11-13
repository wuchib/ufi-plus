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
import { PopoverContext, PopoverProps, popoverContextKey } from './popover'

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: 'hover',
  placement: 'bottom',
})

const popoverWrapRef = useTemplateRef('popover')
const triggerEl = ref<HTMLElement | null>(null)
const contentEl = ref<HTMLElement | null>(null)
const isShowPop = ref(false)

const placement = computed(() => props.placement ?? 'bottom')
const trigger = computed(() => props.trigger ?? 'hover')

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

const hidePopover = () => {
  clearHideTimer()
  isShowPop.value = false
}

const hidePopoverWithDelay = () => {
  clearHideTimer()
  hideTimer = window.setTimeout(() => {
    isShowPop.value = false
    hideTimer = null
  }, 150)
}

const togglePopover = () => {
  clearHideTimer()
  isShowPop.value = !isShowPop.value
}

const handleTriggerMouseEnter = () => {
  if (trigger.value !== 'hover') return
  showPopover()
}

const handleTriggerMouseLeave = () => {
  if (trigger.value !== 'hover') return
  hidePopoverWithDelay()
}

const handleTriggerClick = () => {
  if (trigger.value !== 'click') return
  togglePopover()
}

const handleContentMouseEnter = () => {
  if (trigger.value !== 'hover') return
  showPopover()
}

const handleContentMouseLeave = () => {
  if (trigger.value !== 'hover') return
  hidePopoverWithDelay()
}

const handleDocumentClick = (event: MouseEvent) => {
  if (trigger.value !== 'click') return
  const target = event.target as Node | null
  console.log(target); // todo 不足：注册了几个组件就触发了几次，待优化
  const triggerNode = triggerEl.value
  const content = contentEl.value
  if (!target || !triggerNode) return
  if (triggerNode.contains(target)) return
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
  if (trigger.value === 'click') {
    document.addEventListener('click', handleDocumentClick, true)
  }
})

onUnmounted(() => {
  unregisterTriggerEvent()
  clearHideTimer()
  if (trigger.value === 'click') {
    document.removeEventListener('click', handleDocumentClick, true)
  }
})

const context: PopoverContext = {
  isOpen: isShowPop,
  trigger,
  placement,
  triggerEl,
  contentEl,
  show: showPopover,
  hide: hidePopover,
  hideWithDelay: hidePopoverWithDelay,
  toggle: togglePopover,
  onContentMouseEnter: handleContentMouseEnter,
  onContentMouseLeave: handleContentMouseLeave,
}

provide(popoverContextKey, context)
</script>

<style scoped>
.ufi-popover {
}
</style>
