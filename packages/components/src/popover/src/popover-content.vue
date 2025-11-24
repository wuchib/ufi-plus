<template>
  <teleport :to="POPOVER_ROOT_SELECTOR">
    <Transition name="ufi-popover-motion" appear>
      <div 
        v-if="isShowPop" 
        ref="popContent" 
        :class="['ufi-popover-content']"
        :style="{ top: contentPos.top + 'px', left: contentPos.left + 'px' }" 
        :data-placement="currentPlacement"
        :data-align="currentAlign" 
        @mouseenter="onContentMouseEnter" 
        @mouseleave="onContentMouseLeave"
      > 
        <!-- 箭头 -->
        <div 
          ref="arrow"
          v-if="showArrow" 
          class="show-arrow"
          :class="[ arrowOrientationClass ]"
          :style="{
            ...arrowPositionStyle,
            width: triggerGap + 'px',
            height: triggerGap + 'px'
          }"
        >
        </div>
        <!-- 这是弹出框 -->
        <div :class="['ufi-popover-content__inner', popClass]">
          <slot />
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef, watch, watchEffect } from 'vue'
import { PopoverContext, placementType, popoverContextKey, BasePlacement, PlacementAlign, ContentPos, ArrowPosition } from './popover'
import { useFocusTrap } from './useFocusTrap'
import { TRIGGER_GAP } from './config'

import { calcContentPos } from './utils'

const popover = inject(popoverContextKey) as PopoverContext | undefined
if (!popover) {
  throw new Error('PopoverContent must be used inside Popover')
}

const {
  isOpen: isShowPop,
  placement,
  trigger,
  showArrow,
  popClass,
  triggerEl,
  contentEl: providedContentEl,
  arrowEl: providedArrowEl,
  onContentMouseEnter,
  onContentMouseLeave,
} = popover

const contentPos = ref<ContentPos>({ top: 0, left: 0 })
const currentPlacement = ref<BasePlacement>('bottom')
const currentAlign = ref<PlacementAlign>('center')
const contentEl = useTemplateRef('popContent') // 弹出层 dom 引用
const arrowEl = useTemplateRef('arrow') // 箭头 dom 引用
const isClient = typeof window !== 'undefined'
const POPOVER_ROOT_ID = 'ufi-popover-root'
const POPOVER_ROOT_SELECTOR = `#${POPOVER_ROOT_ID}`


// 箭头位置
const arrowPosition = ref<ArrowPosition>({
  left: void 0,
  top: void 0,
  right: void 0,
  bottom: void 0,
})

// 箭头朝向 （暂时通过placement 计算）
const arrowOrientationClass = computed(()=>{
  return 'tri-' + currentPlacement.value
})

/**
 * 计算箭头位置 style
 */
const arrowPositionStyle = computed(()=>{
  const styleRes: Partial<Record<'left' | 'top' | 'right' | 'bottom', string>> = {}
  for( const k in arrowPosition.value){
    const key = k as keyof ArrowPosition
    if(arrowPosition.value[key] !== undefined){
      styleRes[key] = arrowPosition.value[key] + 'px'
    }
  }
  return styleRes
})

/**
 * 在弹出层外层添加 fixed 父容器，方便弹层相对定位
 */
const ensurePopoverRoot = () => {
  if (!isClient) return null
  let root = document.getElementById(POPOVER_ROOT_ID)
  if (!root) {
    root = document.createElement('div')
    root.id = POPOVER_ROOT_ID
    Object.assign(root.style, {
      // position: 'fixed',
      position: 'absolute',
      zIndex: '9999',
      pointerEvents: 'none',
      left: '0',
      right: '0',
      top: '0',
      height: '0',
    })
    document.body.appendChild(root)
  }
  return root
}

if (isClient) {
  ensurePopoverRoot()
}
const POSITION_EPSILON = ref(0.5)


watchEffect(()=>{
  providedContentEl.value = contentEl.value
  providedArrowEl.value = arrowEl.value
})

const handleAutoPosition = (customPlacement?: placementType) => {
  if (!isShowPop.value || !triggerEl.value) return
  calcContentPos(
    customPlacement || placement.value || 'bottom',
    triggerEl.value,
    contentEl.value,
    arrowEl.value,
    contentPos,
    currentPlacement,
    currentAlign,
    arrowPosition
  )
}

watch(
  () => placement.value,
  (pVal) => {
    handleAutoPosition(pVal || 'bottom')
  },
  { immediate: true }
)

type RectSnapshot = { top: number; left: number; width: number; height: number }
let rafId: number | null = null
let lastRect: RectSnapshot | null = null


const rectChanged = (prev: RectSnapshot, next: RectSnapshot) =>
  Math.abs(prev.top - next.top) > POSITION_EPSILON.value ||
  Math.abs(prev.left - next.left) > POSITION_EPSILON.value ||
  Math.abs(prev.width - next.width) > POSITION_EPSILON.value ||
  Math.abs(prev.height - next.height) > POSITION_EPSILON.value

const stopFrameTracking = () => {
  if (!isClient) return
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  lastRect = null
}

const startFrameTracking = () => {
  if (!isClient) return
  stopFrameTracking()
}

let activate: () => void, deactivate: () => void



watch(
  () => isShowPop.value,
  async (show) => {
    if (show) {
      await nextTick()
      calcContentPos(
        placement.value || 'bottom',
        triggerEl.value,
        contentEl.value,
        arrowEl.value,
        contentPos,
        currentPlacement,
        currentAlign,
        arrowPosition
      )
      startFrameTracking();
      ({ activate, deactivate } = useFocusTrap(contentEl.value as HTMLElement, { visible: isShowPop, trigger }));
      activate()
    } else {
      stopFrameTracking()
      deactivate()
    }
  }
)

const windowEventHandler = () => {
  handleAutoPosition()
}

let contentResizeObserver: ResizeObserver | null = null
let observedContent: HTMLElement | null = null

const stopObservingContent = () => {
  if (contentResizeObserver && observedContent) {
    contentResizeObserver.unobserve(observedContent)
  }
  observedContent = null
}

const ensureContentObserver = () => {
  if (contentResizeObserver || !isClient || typeof ResizeObserver === 'undefined') return
  contentResizeObserver = new ResizeObserver(() => {
    handleAutoPosition()
  })
}

watch(
  triggerEl,
  (el) => {
    if (!el) return
    handleAutoPosition()
  },
  { immediate: true }
)

watch(
  contentEl,
  (el) => {
    stopObservingContent()
    if (!el) return
    ensureContentObserver()
    contentResizeObserver?.observe(el)
    observedContent = el
    handleAutoPosition()
  },
  { immediate: true }
)

onMounted(() => {
  if (!isClient) return
  window.addEventListener('resize', windowEventHandler)
})

onBeforeUnmount(() => {
  if (isClient) {
    window.removeEventListener('resize', windowEventHandler)
  }
  contentResizeObserver?.disconnect()
  observedContent = null
  stopFrameTracking()
})

const triggerGap = ref(TRIGGER_GAP)



</script>

<style scoped>
.ufi-popover-content {
  position: absolute;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  pointer-events: all;
  padding: 4px;
  --ufi-motion-x: 0px;
  --ufi-motion-y: 0px;
  --ufi-motion-scale: 0.94;
}

.ufi-popover-content__inner{
  white-space: normal;
  word-break: break-word;
  border-radius: 8px;
}

/* 箭头样式 */
.ufi-popover-content .show-arrow{
  position: absolute;
  /* 通过弹出层容器宽高计算 top left */
  width: 5px;
  height: 5px;
  border: 1px solid #ccc;
  transform: rotate(45deg);
  background-color: #fff;
  box-sizing: border-box;
}

/* 方向类 */
.ufi-popover-content .show-arrow.tri-bottom { 
  border-bottom-color: #fff;
  border-right-color: #fff;
}
.ufi-popover-content .show-arrow.tri-top  { 
  border-top-color: #fff;
  border-left-color: #fff;
}
.ufi-popover-content .show-arrow.tri-right  {
  border-top-color: #fff;
  border-right-color: #fff;
}
.ufi-popover-content .show-arrow.tri-left { 
  border-bottom-color: #fff;
  border-left-color: #fff;
}

.ufi-popover-motion-enter-active,
.ufi-popover-motion-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.ufi-popover-motion-enter-from,
.ufi-popover-motion-leave-to {
  opacity: 0;
  transform: translate3d(var(--ufi-motion-x), var(--ufi-motion-y), 0) scale(var(--ufi-motion-scale));
}

.ufi-popover-content[data-placement='top'] {
  --ufi-motion-y: 10px;
}

.ufi-popover-content[data-placement='bottom'] {
  --ufi-motion-y: -10px;
}

.ufi-popover-content[data-placement='left'] {
  --ufi-motion-x: 10px;
}

.ufi-popover-content[data-placement='right'] {
  --ufi-motion-x: -10px;
}

.ufi-popover-content[data-placement='top'][data-align='start'],
.ufi-popover-content[data-placement='bottom'][data-align='start'] {
  --ufi-motion-x: -6px;
}

.ufi-popover-content[data-placement='top'][data-align='end'],
.ufi-popover-content[data-placement='bottom'][data-align='end'] {
  --ufi-motion-x: 6px;
}

.ufi-popover-content[data-placement='left'][data-align='start'],
.ufi-popover-content[data-placement='right'][data-align='start'] {
  --ufi-motion-y: -6px;
}

.ufi-popover-content[data-placement='left'][data-align='end'],
.ufi-popover-content[data-placement='right'][data-align='end'] {
  --ufi-motion-y: 6px;
}
</style>
