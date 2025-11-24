<script setup lang="ts">
import { UButton, UPoppover } from 'ufi-plus'
import { ref } from 'vue';

const visible = ref(false)
</script>

<template>
  <div style="padding:24px; position:relative;height: 1000px;width: 100vw;">
    <div class="test">
      <UPoppover trigger="click" placement="right-end" show-arrow pop-class="customClass">
        <UButton type="primary">Primary</UButton>
        <template #content>
          <div style="font-size: 12px;">
            Naive UI 是一个 Vue3 的组件库。
          要了解如何安装，参见安装。
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          </div>
        </template>
      </UPoppover>
    </div>


  </div>
</template>

<style>
.test {
  position: absolute;
  top: 100px;
  left: 100px;
}
.customClass{
  width: 900px;
  height: 100px;
  overflow: auto;
}
</style>
