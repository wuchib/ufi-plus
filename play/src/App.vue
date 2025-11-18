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
    <UPoppover trigger="click" placement="bottom-end">
      <UButton type="primary" >Primary</UButton>
      <template #content>
        123456789
      </template>
    </UPoppover>
    </div>
    

  </div>
</template>

<style>
.test{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
}
</style>
