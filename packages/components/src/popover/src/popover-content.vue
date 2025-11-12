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
const contentEl = useTemplateRef('popContent') // 弹出层dom

watch(
  () => placement.value,
  (pVal) => {
    if (!triggerEl.value) return
    calcContentPos(pVal || 'bottom')
  },
  { immediate: true }
)

watch(
  () => isShowPop.value,
  async (show) => {
    if (show) {
      await nextTick() // 确认弹出之后再计算位置
      calcContentPos(placement.value || 'bottom')
    }
  }
)



function calcContentPos(val: placementType) {
  const triggerDomRect = triggerEl.value?.getBoundingClientRect()
  const contentDomRect = contentEl.value?.getBoundingClientRect()
  
  
  if (!triggerDomRect)  return console.log('没有触发器');
  if (!contentDomRect)  return console.log('没有弹出层');
  const { width: tWidth, height: tHeight } = triggerDomRect
  const { width: cWidth, height: cHeight } = contentDomRect 

  const posMap = {
    'top' : ()=>{
      contentPos.value.top = triggerDomRect.top - contentDomRect.height
      const diffNum = (cWidth >= tWidth) ? - (cWidth - tWidth) / 2 : (tWidth - cWidth) / 2
      contentPos.value.left = triggerDomRect.left + diffNum
    },

    'bottom' : ()=>{
      contentPos.value.top = triggerDomRect.bottom
      const diffNum = (cWidth >= tWidth) ? - (cWidth - tWidth) / 2 : (tWidth - cWidth) / 2
      contentPos.value.left = triggerDomRect.left + diffNum
    },

    'left' : ()=>{
      const diffNum = (cHeight >= tHeight) ? - (cHeight - tHeight) / 2 : (tHeight - cHeight) / 2
      contentPos.value.top = triggerDomRect.top + diffNum
      contentPos.value.left = triggerDomRect.left - cWidth
    },

    'right' : ()=>{
      const diffNum = (cHeight >= tHeight) ? - (cHeight - tHeight) / 2 : (tHeight - cHeight) / 2
      contentPos.value.top = triggerDomRect.top + diffNum
      contentPos.value.left = triggerDomRect.right
    },
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
