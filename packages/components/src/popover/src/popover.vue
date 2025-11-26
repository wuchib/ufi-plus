<template>
  <div ref="popover">
    <slot />
    <PopoverContent>
      <slot name="content"></slot>
    </PopoverContent>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, useTemplateRef, watch } from 'vue'
import PopoverContent from './popover-content.vue'
import { PopoverContext, PopoverProps, popoverContextKey, PopoverEmits } from './popover'

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: 'hover',
  placement: 'bottom',
  visible: undefined, // 若传入 visible ， 则弹窗的显隐由该属性控制 
  showArrow: true
})

const emit = defineEmits<PopoverEmits>()

const popoverWrapRef = useTemplateRef('popover')
const triggerEl = ref<HTMLElement | null>(null)
const contentEl = ref<HTMLElement | null>(null)
const arrowEl = ref<HTMLElement | null>(null)
const innerVisible = ref(props.visible ?? false)
const isControlled = computed(() => props.visible !== undefined)
const isShowPop = computed(() => (isControlled.value ? !!props.visible : innerVisible.value))
const x = computed(() => props.x)
const y = computed(() => props.y)


const placement = computed(() => props.placement ?? 'bottom')
const trigger = computed(() => props.trigger ?? 'hover')
const showArrow = computed(()=> props.showArrow)
const popClass = computed(() => props.popClass ?? '')

let hideTimer: ReturnType<typeof window.setTimeout> | null = null

const clearHideTimer = () => {
  if (hideTimer !== null) {
    window.clearTimeout(hideTimer)
    hideTimer = null
  }
}

const setVisible = (value: boolean) => {
  clearHideTimer()
  if (value === isShowPop.value) return
  if (!isControlled.value) {
    innerVisible.value = value
    emit('update:visible', value)
  }
}

const showPopover = () => {
  setVisible(true)
}

const hidePopover = () => {
  setVisible(false)
}

const hidePopoverWithDelay = () => {
  clearHideTimer()
  hideTimer = setTimeout(() => {
    setVisible(false)
    hideTimer = null
  }, 150)
}

const togglePopover = () => {
  clearHideTimer()
  setVisible(!isShowPop.value)
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
  if (['click', 'manual'].includes(trigger.value)) togglePopover()
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
  // console.log(target); // todo 不足：注册了几个组件就触发了几次，待优化
  const triggerNode = triggerEl.value
  const content = contentEl.value
  if (!target || !triggerNode) return
  if (triggerNode.contains(target)) return
  if (content?.contains(target)) return
  setVisible(false)
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
  if(triggerEl.value === null && trigger.value === 'manual' ){
    return
    /**
     * todo.. 当没有触发器元素 且 传入了 x 和 y
     * 1. 不需注册按钮事件
     * 2. 监听 visible ,为 true 时赋予弹出层 位置信息 x, y
     * 3. 定位为 fixed
     * 4. 位置计算
     */
  }
  registerTriggerEvent()
  if (trigger.value === 'click') {
    document.addEventListener('click', handleDocumentClick, true)
  }
})

watch(
  () => props.visible,
  (val) => {
    if (val === undefined) return
    innerVisible.value = val
  }
)

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
  showArrow,
  triggerEl,
  contentEl,
  arrowEl,
  popClass,
  show: showPopover,
  hide: hidePopover,
  hideWithDelay: hidePopoverWithDelay,
  toggle: togglePopover,
  onContentMouseEnter: handleContentMouseEnter,
  onContentMouseLeave: handleContentMouseLeave,
  x,
  y
}

provide(popoverContextKey, context)
</script>

<style scoped>
.ufi-popover {}
</style>
