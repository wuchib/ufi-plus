<script setup lang="ts">
import { UButton, UPoppover } from 'ufi-plus'
import { ref } from 'vue';

const visible = ref(false)
</script>

<template>
  <div style="padding:24px">
    <h1>ufi-plus playground</h1>
    <!-- <UButton type="primary">Primary</UButton>
    <UButton type="success" round>Success</UButton>
    <UButton type="warning" plain>Warning</UButton> -->
    <button @click="visible = !visible">点击切换显隐</button>
    <hr>
    <div class="test">
      <!-- <UPoppover trigger="click" placement="left">
        <UButton type="primary">Primary</UButton>
        <template #content>
          Naive UI 是一个 Vue3 的组件库。
          要了解如何安装，参见安装。
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
        </template>
      </UPoppover> -->

      <UPoppover trigger="click" show-arrow pop-class="customClass">
        <UButton type="primary">Primary</UButton>
        <template #content>
          Naive UI 是一个 Vue3 的组件库。
          要了解如何安装，参见安装。
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
          它比较完整，主题可调，用 TypeScript 写的，快
        </template>
      </UPoppover>
    </div>


  </div>
</template>

<style>
.test {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
}
.customClass{
  width: 100px;
}
</style>
