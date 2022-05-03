<template>
  <!-- 顶部导航 -->
  <home-header />
  <!-- 主体区域 -->
  <home-main />
  <!-- 公共尾部 -->
  <layout-footer />
</template>

<script setup>
import HomeHeader from './components/HomeHeader.vue'
import HomeMain from './components/HomeMain.vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
</script>

<style lang="scss" scoped>
.home-main {
  background-color: #f7f7f7;
  padding: 50px 0;
}
</style>
