<template>
  <div ref="popover">
    <slot />
    <popover-content />
  </div>
</template>

<script setup lang="ts">
import { PopoverProps } from './popover'
import PopoverContent from './popover-content.vue'
import { onMounted, useTemplateRef, ref, provide, computed } from 'vue'

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: 'hover',
  placement: 'bottom',
})

// 包裹触发器的顶层盒子
const popoverWrapRef = useTemplateRef('popover')

// 触发器dom
const triggerEl = ref<HTMLElement | null>(null)

// 是否显示 弹出层
const isShowPop = ref(false)
// 弹出层位置
const placement = computed(() => props.placement || 'top')
// typeof placement.value
onMounted(() => {
  triggerEl.value = popoverWrapRef.value?.firstElementChild as HTMLElement | null

  // 注册 triggerEl 的触发事件
  registerTriggerEvent()
})


function registerTriggerEvent() {
  triggerEl.value?.addEventListener('mouseenter', () => {
    if (props.trigger !== 'hover') return
    isShowPop.value = true
  })

  triggerEl.value?.addEventListener('mouseleave', () => {
    if (props.trigger !== 'hover') return
    isShowPop.value = false
  })

  triggerEl.value?.addEventListener('click', () => {
    if (props.trigger !== 'click') return
    isShowPop.value = !isShowPop.value
  })
}

provide('isShowPop', isShowPop)
provide('placement', placement)
provide('triggerEl', triggerEl)

</script>

<style scoped>
.ufi-popover {
  
}
</style>
