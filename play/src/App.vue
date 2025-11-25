<script setup lang="ts">
import { UButton, UPoppover } from 'ufi-plus'

</script>

<template>
  <div style="padding:24px; position:relative;height: 1000px;width: 100vw;">
    <div class="test">
      <UPoppover trigger="click" placement="right-end" show-arrow pop-class="customClass">
        <UButton type="primary">Primary</UButton>
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
