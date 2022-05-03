<template>
  <van-pull-refresh
    v-model="refreshing"
    @refresh="onRefresh"
    class="home-main"
  >
    <!-- 轮播图 -->
    <van-swipe
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
    >
      <van-swipe-item
        v-for="(item, index) in swipeData"
        :key="index"
      >
        <img :src="item.img">
      </van-swipe-item>
    </van-swipe>

    <!-- 菜单列表 -->
    <van-grid icon-size="40">
      <van-grid-item
        v-for="(item, index) in menuData"
        :key="index"
        :icon="item.img"
        :text="item.info[0].value"
      />
    </van-grid>

    <!-- 公告区域 -->
    <van-notice-bar
      left-icon="fire"
      :scrollable="false"
    >
      <span>热点资讯公告：</span>
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item, index) in newsData"
          :key="index"
          v-text="item.chiild[0].val"
        />
      </van-swipe>
    </van-notice-bar>

    <!-- 商品列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="initProductsData"
    >
      <product-list :products-data="goodsData" />
    </van-list>
  </van-pull-refresh>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getDefaultData } from '@/api/home.js'
import { getProductsData } from '@/api/product.js'
import ProductList from '@/components/ProductList.vue'

// 声明响应式数据，用来存储首页的响应式数据
const indexData = ref({})

// 封装首页数据初始化的功能
const initIndexData = async () => {
  const data = await getDefaultData()
  if (data.status !== 200) {
    return false
  } else {
    indexData.value = data.data
  }
}
initIndexData()

// 通过计算属性保存需要使用的数据
// 1.轮播图 第一次读取可能没有数据，采用 【可选链操作符?】去判断是否存在swiperBg，存在就继续执行
const swipeData = computed(() => indexData.value.data?.swiperBg.default.imgList.list)
// 2.菜单列表数据
const menuData = computed(() => indexData.value.data?.menus.default.imgList.list)
// 3.公告区域数据
const newsData = computed(() => indexData.value.data?.news.default.newList.list)
// 4.商品功能
// 默认请求第一页
let page = 1
const limit = 4
const loading = ref(false)
const finished = ref(false)
const goodsData = ref([])
const initProductsData = async () => {
  const { data } = await getProductsData({
    limit,
    page
  })
  if (data.status !== 200) {
    return false
  } else {
    goodsData.value.push(...data.data)
    // 变更页数
    page++
    // 触底后需要手动关闭loading状态，让其加载数据
    loading.value = false
    if (data.data.length < limit) {
      finished.value = true
    }
  }
}
// 使用list组件后会自动加载触底数据以及后续数据，孤儿无需调用！！！
// initProductsData()
// 下拉刷新功能 --一切还原初始值
const refreshing = ref(false)
const onRefresh = () => {
  // 清空数据
  indexData.value = {}
  goodsData.value = []
  // 页码还原
  page = 1
  // 触底加载状态还原
  loading.value = false
  finished.value = false
  // 重新发送请求
  initIndexData()
  initProductsData()
  // 刷新结束要结束refreshing状态为false
  refreshing.value = false
}

</script>

<style lang="scss" scoped>
// 轮播区域样式
.home-main {
  .my-swipe img {
    width: 100%;
  }
}

// 公告区域样式
.van-notice-bar {
  margin-top: 10px;
  color: whitesmoke;
  background: lightpink;
}

:deep(.van-notice-bar__content) {
  display: flex;
  align-items: center;
}

.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
