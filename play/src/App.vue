<script setup lang="ts">
import { UButton, UPoppover } from 'ufi-plus'
import { ref } from 'vue';
const visible = ref(false)
const x = ref(0)
const y = ref(0)

function handleClick(e: MouseEvent) {
  if (visible.value) {
    visible.value = false
  }
  else {
    visible.value = true
    x.value = e.clientX
    y.value = e.clientY
  }
}
</script>

<template>
  <div style="padding:24px; position:relative;height: 1000px;width: 100vw;" @click="handleClick">
    
    <div class="test">
      <UPoppover :visible="visible" :x="x" :y="y" placement="left" :show-arrow="false" trigger="manual" pop-class="customClass">
        <!-- <UButton type="primary">Primary</UButton> -->
        <template #content>
          <div style="font-size: 12px;">
            Naive UI 是一个 Vue3 的组件库。
          </div>
        </template>
      </UPoppover>
    </div>


  </div>
</template>

<style>
.test {
  position: absolute;
  top: 250px;
  right: 500px;
}
.customClass{
}
</style>
