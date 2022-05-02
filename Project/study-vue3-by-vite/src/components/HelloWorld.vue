<script setup>
import { shallowReactive } from '@vue/reactivity'
const dataList = shallowReactive({
  count: 0,
  obj: {
    name: '小米',
    age: 18
  }
})
const handleClick = () => {
  dataList.obj = { a: 1, b: 2 }
}
</script>

<template>
  <div v-text="dataList.obj" />
  <button @click="handleClick" />
</template>

<style>
</style>
