<template>
  <teleport :to="POPOVER_ROOT_SELECTOR">
    <Transition name="ufi-popover-motion" appear>
      <div
        v-if="isShowPop"
        ref="popContent"
        class="ufi-popover-content"
        :style="{ top: contentPos.top + 'px', left: contentPos.left + 'px' }"
        :data-placement="currentPlacement"
        :data-align="currentAlign"
        @mouseenter="onContentMouseEnter"
        @mouseleave="onContentMouseLeave"
      >
        这是弹出框
        <slot />
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { PopoverContext, placementType, popoverContextKey } from './popover'
import { useFocusTrap } from './useFocusTrap'

const popover = inject(popoverContextKey) as PopoverContext | undefined
if (!popover) {
  throw new Error('PopoverContent must be used inside Popover')
}

const {
  isOpen: isShowPop,
  placement,
  trigger,
  triggerEl,
  contentEl: providedContentEl,
  onContentMouseEnter,
  onContentMouseLeave
} = popover

const contentPos = ref<{ top: number; left: number }>({ top: 0, left: 0 })
const currentPlacement = ref<BasePlacement>('bottom')
const currentAlign = ref<PlacementAlign>('center')
const contentEl = useTemplateRef('popContent') // ������dom
const isClient = typeof window !== 'undefined'
const POPOVER_ROOT_ID = 'ufi-popover-root'
const POPOVER_ROOT_SELECTOR = `#${POPOVER_ROOT_ID}`

const ensurePopoverRoot = () => {
  if (!isClient) return null
  let root = document.getElementById(POPOVER_ROOT_ID)
  if (!root) {
    root = document.createElement('div')
    root.id = POPOVER_ROOT_ID
    Object.assign(root.style, {
      position: 'fixed',
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
const POSITION_EPSILON = 0.5
type BasePlacement = 'top' | 'bottom' | 'left' | 'right'
type PlacementAlign = 'start' | 'end' | 'center'

watch(
  () => contentEl.value,
  (el) => {
    providedContentEl.value = el
  },
  { immediate: true }
)

const handleAutoPosition = (customPlacement?: placementType) => {
  if (!isShowPop.value || !triggerEl.value) return
  calcContentPos(customPlacement || placement.value || 'bottom')
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
  Math.abs(prev.top - next.top) > POSITION_EPSILON ||
  Math.abs(prev.left - next.left) > POSITION_EPSILON ||
  Math.abs(prev.width - next.width) > POSITION_EPSILON ||
  Math.abs(prev.height - next.height) > POSITION_EPSILON

const stopFrameTracking = () => {
  if (!isClient) return
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  lastRect = null
}

const trackTriggerPosition = () => {
  if (!isClient || !isShowPop.value || !triggerEl.value) {
    stopFrameTracking()
    return
  }
  const rect = triggerEl.value.getBoundingClientRect()
  const snapshot: RectSnapshot = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  }
  if (!lastRect || rectChanged(lastRect, snapshot)) {
    lastRect = snapshot
    handleAutoPosition()
  }
  rafId = window.requestAnimationFrame(trackTriggerPosition)
}

const startFrameTracking = () => {
  if (!isClient) return
  stopFrameTracking()
  rafId = window.requestAnimationFrame(trackTriggerPosition)
}

let activate: () => void, deactivate: () => void



watch(
  () => isShowPop.value,
  async (show) => {
    if (show) {
      await nextTick() 
      calcContentPos(placement.value || 'bottom')
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

let resizeObserver: ResizeObserver | null = null // 监听器
let observedTrigger: HTMLElement | null = null

const stopObservingTrigger = () => {
  if (resizeObserver && observedTrigger) {
    resizeObserver.unobserve(observedTrigger)
  }
  observedTrigger = null
}

const ensureResizeObserver = () => {
  if (resizeObserver || !isClient || typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(() => {
    handleAutoPosition()
  })
}

watch(
  triggerEl,
  (el) => {
    stopObservingTrigger()
    if (!el) return
    ensureResizeObserver()
    resizeObserver?.observe(el)
    observedTrigger = el
    handleAutoPosition()
  },
  { immediate: true }
)

onMounted(() => {
  if (!isClient) return
  window.addEventListener('scroll', windowEventHandler, true)
  window.addEventListener('resize', windowEventHandler)
})

onBeforeUnmount(() => {
  if (isClient) {
    window.removeEventListener('scroll', windowEventHandler, true)
    window.removeEventListener('resize', windowEventHandler)
  }
  resizeObserver?.disconnect()
  observedTrigger = null
  stopFrameTracking()
})

const TRIGGER_GAP = 4

/**
 * 计算弹出层位置
 * @param val 
 */
function calcContentPos(val: placementType) {
  const triggerDomRect = triggerEl.value?.getBoundingClientRect()
  const contentDomRect = contentEl.value?.getBoundingClientRect()

  if (!triggerDomRect) return
  if (!contentDomRect) return
  const { width: tWidth, height: tHeight } = triggerDomRect
  const { width: cWidth, height: cHeight } = contentDomRect

  const [basePlacement, rawAlign] = val.split('-') as [BasePlacement, PlacementAlign?]
  const align: PlacementAlign = rawAlign ?? 'center'
  // 记录视口尺寸，方便判断剩余空间
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : document.documentElement.clientWidth
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : document.documentElement.clientHeight

  // 定义相反方向，用于空间不足时兜底
  const oppositePlacement: Record<BasePlacement, BasePlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  }

  // 检查某个方向是否有足够空间容纳弹层
  const canFit = (placement: BasePlacement) => {
    switch (placement) {
      case 'top':
        return triggerDomRect.top >= cHeight
      case 'bottom':
        return viewportHeight - triggerDomRect.bottom >= cHeight
      case 'left':
        return triggerDomRect.left >= cWidth
      case 'right':
        return viewportWidth - triggerDomRect.right >= cWidth
      default:
        return true
    }
  }

  // 决定最终方向：优先原始方向，不行再尝试相反方向
  const resolvedPlacement: BasePlacement = (() => {
    if (canFit(basePlacement)) return basePlacement
    const fallback = oppositePlacement[basePlacement]
    return fallback && canFit(fallback) ? fallback : basePlacement
  })()
  currentPlacement.value = resolvedPlacement
  currentAlign.value = align

  if (resolvedPlacement === 'top') {
    contentPos.value.top = triggerDomRect.top - cHeight - TRIGGER_GAP
    if (align === 'start') {
      contentPos.value.left = triggerDomRect.left
    } else if (align === 'end') {
      contentPos.value.left = triggerDomRect.right - cWidth
    } else {
      contentPos.value.left = triggerDomRect.left + (tWidth - cWidth) / 2
    }
    return
  }

  if (resolvedPlacement === 'bottom') {
    contentPos.value.top = triggerDomRect.bottom + TRIGGER_GAP
    if (align === 'start') {
      contentPos.value.left = triggerDomRect.left
    } else if (align === 'end') {
      contentPos.value.left = triggerDomRect.right - cWidth
    } else {
      contentPos.value.left = triggerDomRect.left + (tWidth - cWidth) / 2
    }
    return
  }

  if (resolvedPlacement === 'left') {
    contentPos.value.left = triggerDomRect.left - cWidth - TRIGGER_GAP
    if (align === 'start') {
      contentPos.value.top = triggerDomRect.top
    } else if (align === 'end') {
      contentPos.value.top = triggerDomRect.bottom - cHeight
    } else {
      contentPos.value.top = triggerDomRect.top + (tHeight - cHeight) / 2
    }
    return
  }

  if (resolvedPlacement === 'right') {
    contentPos.value.left = triggerDomRect.right + TRIGGER_GAP
    if (align === 'start') {
      contentPos.value.top = triggerDomRect.top
    } else if (align === 'end') {
      contentPos.value.top = triggerDomRect.bottom - cHeight
    } else {
      contentPos.value.top = triggerDomRect.top + (tHeight - cHeight) / 2
    }
  }
}

</script>

<style scoped>
.ufi-popover-content {
  position: absolute;
  z-index: 1000;
  background-color: rgba(255, 255, 255, .7);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  width: 200px;
  height: 200px;
  pointer-events: all;
  --ufi-motion-x: 0px;
  --ufi-motion-y: 0px;
  --ufi-motion-scale: 0.94;
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
