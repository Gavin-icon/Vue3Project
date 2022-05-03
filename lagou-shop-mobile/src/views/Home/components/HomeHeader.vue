<template>
  <div class="home-header">
    <!--logo区域-->
    <img
      height="20"
      src="@/assets/logo.png"
      alt=""
    >
    <!--搜索区域-->
    <div class="search">
      <van-icon
        name="search"
        size="0.5rem"
      />
    </div>
    <!--分类跳转区域-->
    <van-icon name="wap-nav" />
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.home-header {
  position: fixed;
  // 防止被压盖
  z-index: 1000;
  width: 100%;
  height: 50px;
  top: 0;
  left: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    padding: 0 10px;
  }
  .search {
    position: relative;
    width: 100%;
    height: 30px;
    background-color: #f7f7f7;
    border-radius: 25px;
    padding-left: 8px;
    .van-icon {
      position: absolute;
      top: 7px;
      left: 10px;
    }
  }
}
</style>
