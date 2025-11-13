<template>
  <teleport to="body" v-if="isShowPop">
    <div id="toptoptop" style="position: fixed;z-index: 9999;pointer-events: none;left: 0;right: 0;top: 0;height: 0;">
      <div
        ref="popContent"
        class="ufi-popover-content"
        :style="{ top: contentPos.top + 'px', left: contentPos.left + 'px' }"
        @mouseenter="onContentMouseEnter"
        @mouseleave="onContentMouseLeave"
      >
        这是弹出框
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ComputedRef, inject, nextTick, onBeforeUnmount, onMounted, ref, Ref, useTemplateRef, watch } from 'vue'
import { placementType } from './popover'

const isShowPop = inject<Ref<boolean>>('isShowPop')!
const placement = inject<ComputedRef<placementType>>('placement')!
const triggerEl = inject<Ref<HTMLElement | null>>('triggerEl', ref(null))
const onContentMouseEnter = inject<() => void>('onContentMouseEnter', () => {})
const onContentMouseLeave = inject<() => void>('onContentMouseLeave', () => {})

const contentPos = ref<{ top: number; left: number }>({ top: 0, left: 0 })
const contentEl = useTemplateRef('popContent') // ������dom
const isClient = typeof window !== 'undefined'
const POSITION_EPSILON = 0.5

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
let lastRect: RectSnapshot | null = null  // 记录上一次的  触发器dom 的位置


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

watch(
  () => isShowPop.value,
  async (show) => {
    if (show) {
      await nextTick() 
      calcContentPos(placement.value || 'bottom')
      startFrameTracking()
    } else {
      stopFrameTracking()
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

function calcContentPos(val: placementType) {
  const triggerDomRect = triggerEl.value?.getBoundingClientRect()
  const contentDomRect = contentEl.value?.getBoundingClientRect()

  if (!triggerDomRect) return console.log('û�д�����')
  if (!contentDomRect) return console.log('û�е�����')
  const { width: tWidth, height: tHeight } = triggerDomRect
  const { width: cWidth, height: cHeight } = contentDomRect

  const posMap = {
    top: () => {
      contentPos.value.top = triggerDomRect.top - contentDomRect.height
      const diffNum = cWidth >= tWidth ? -(cWidth - tWidth) / 2 : (tWidth - cWidth) / 2
      contentPos.value.left = triggerDomRect.left + diffNum
    },
    bottom: () => {
      contentPos.value.top = triggerDomRect.bottom
      const diffNum = cWidth >= tWidth ? -(cWidth - tWidth) / 2 : (tWidth - cWidth) / 2
      contentPos.value.left = triggerDomRect.left + diffNum
    },
    left: () => {
      const diffNum = cHeight >= tHeight ? -(cHeight - tHeight) / 2 : (tHeight - cHeight) / 2
      contentPos.value.top = triggerDomRect.top + diffNum
      contentPos.value.left = triggerDomRect.left - cWidth
    },
    right: () => {
      const diffNum = cHeight >= tHeight ? -(cHeight - tHeight) / 2 : (tHeight - cHeight) / 2
      contentPos.value.top = triggerDomRect.top + diffNum
      contentPos.value.left = triggerDomRect.right
    }
  }
  posMap[val]?.()
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
}
</style>
