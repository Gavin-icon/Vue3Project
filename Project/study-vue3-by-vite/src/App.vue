<script setup>
import { watchEffect } from '@vue/runtime-core'
import { reactive, ref } from '@vue/reactivity'
const dataList = reactive({
  num: 0
})
const count = ref(10)
watchEffect(() => {
  console.log(`使用了count: ${count.value} 与 num : ${dataList.num}`)
})
</script>

<template>
  <div v-text="count" />
  <button @click="handle">
    Count
  </button>
</template>

<style>
</style>
