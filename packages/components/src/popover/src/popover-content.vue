<template>
  <teleport to="body" v-if="isShowPop">
    <div 
      class="ufi-popover-content"
      :style="{ top: contentPos.top + 'px', left: contentPos.left + 'px' }"
    >
      这是弹出层
      <slot />
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ComputedRef, inject, ref, Ref, watch } from 'vue'
import { placementType } from './popover'
// 注入是否显示弹出层的状态
const isShowPop = inject('isShowPop') as Ref<boolean>
const placement = inject('placement') as  ComputedRef<placementType>
const triggerEl = inject('triggerEl') as ComputedRef<HTMLElement | null>

// 弹出层的位置
const contentPos = ref<{ top: number; left: number }>({ top: 0, left: 0 })

watch(()=> placement.value, (pVal) => {
  console.log(triggerEl.value);
  if(!triggerEl.value) return
  const val = pVal || 'bottom'
  calcContentPos(val)
}, { immediate: true })

watch(()=> isShowPop.value, (show) => {
  if(show){
    const val = placement.value || 'bottom'
    calcContentPos(val)
  }
})



function calcContentPos(val: placementType){
  const rect = triggerEl.value?.getBoundingClientRect()
  if(!rect) return
  switch (val) {
    case 'top':
      contentPos.value.top = rect.top - 200 // 假设弹出层高度为200
      contentPos.value.left = rect.left + rect.width / 2 - 100 // 假设弹出层宽度为200
      break
    case 'bottom':
      contentPos.value.top = rect.bottom
      contentPos.value.left = rect.left + rect.width / 2 - 100
      console.log(contentPos.value);
      break
    case 'left':
      contentPos.value.top = rect.top + rect.height / 2 - 100
      contentPos.value.left = rect.left - 200
      break
    case 'right':
      contentPos.value.top = rect.top + rect.height / 2 - 100
      contentPos.value.left = rect.right
      break
  }
}



</script>

<style scoped>
.ufi-popover-content{
  position: absolute;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  width: 200px;
  height: 200px;
}
</style>