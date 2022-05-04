<template>
  <van-nav-bar fixed left-arrow left-text="返回" @click-left="goBack" />
  <van-tabs scrollspy sticky>
    <van-tab title="商品">
      <!-- 1.轮播图区域  -->
      <van-swipe :autoplay="3000" lazy-render>
        <van-swipe-item v-for="(image, index) in sliderImage" :key="index">
          <img :src="image">
        </van-swipe-item>
      </van-swipe>
      <!-- 2.商品头部区域 -->
      <van-cell class="productHeader" :border="false">
        <template #title>
          <div class="price">
            <!-- 1.商品价格 -->
            <span>￥{{ storeInfo?.price }}</span>
            <!-- 分享按钮 -->
            <van-icon name="share-o" />
          </div>
          <!-- 2.商品标题 -->
          <div class="title" v-text="storeInfo?.store_name" />
        </template>
        <!-- 其他信息 -->
        <template #label>
          <span>原价：￥{{ storeInfo?.ot_price }}</span>
          <span>库存：{{ storeInfo?.stock + storeInfo?.unit_name.lastIndexOf('件') !== -1 ? storeInfo?.unit_name : storeInfo.unit_name + '件' }}</span>
          <span>销量： {{ storeInfo?.fsales }}</span>
        </template>
      </van-cell>
      <!-- 3.商品规格选择区域 -->
      <van-cell class="productSelect" is-link>
        <template #title>
          <span>已选择：</span>
        </template>
      </van-cell>
    </van-tab>
    <van-tab title="评价" class="comment">
      <van-cell-group>
        <!-- 1.总体评价区域 -->
        <van-cell is-link :title="replyInfo" :value="replyRate" to="/" />
        <!-- 2.评价列表区域 -->
        <comment-item :reply="reply" v-if="replyCount" />
      </van-cell-group>
    </van-tab>
    <van-tab title="推荐">
      内容1
    </van-tab>
    <van-tab title="详情">
      内容1
    </van-tab>
  </van-tabs>
</template>

<script setup>
import { getProductDetails } from '@/api/product'
import { computed, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
// 引入组件
import CommentItem from '@/components/CommentItem.vue'
const router = useRouter()
// 返回上一页
const goBack = () => {
  // history.back()
  router.push({
    name: 'home'
  })
}
// 获取商品id
const { productId } = defineProps({
  productId: {
    type: String,
    required: true
  }
})
// 声明变量存储商品信息
const productDetails = ref({})
// 获取对应商品的详细信息
const initProductDetail = async () => {
  const { data } = await getProductDetails(productId)
  // console.log(data)
  if (data.status !== 200) {
    // 找不到对应商品
    return router.push({
      name: 'home'
    })
  }
  productDetails.value = data.data
}
initProductDetail()

// 商品数据处理
// 1.商品详情信息
const storeInfo = computed(() => productDetails.value.storeInfo)
const sliderImage = computed(() => storeInfo.value?.slider_image)

// 评价信息
// 好评数
const replyCount = computed(() => productDetails.value.replyCount || 0)
const replyInfo = computed(() => `用户评价(${replyCount.value})`)
// 好评率
const replyChance = computed(() => productDetails.value.replyChance || 0)
const replyRate = computed(() => `${replyChance.value}%好评率`)
// 好评信息
const reply = computed(() => productDetails.value.reply)

</script>

<style lang="scss" scoped>
// 商品区域整体的背景色
.van-tabs {
  background-color: #f2f2f2;
}
/* ********第一个van-tap区域：商品*********** */
// 顶部nav-bar固定，防止后续变化
.nav-bar {
  position: fixed !important;
}
// 顶部van-tabs__wrap固定，且设置定位
:deep(.van-tabs__wrap) {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-40%);
  width: 80%;
  z-index: 1000;
}
// van-tabs__content显示设置
:deep(.van-tabs__content) {
  padding-top: 46px;
}
// 轮播图图片处理
.van-swipe {
  width: 375px;
  height: 325px;
  .van-swipe-item {
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
// 当前激活条样式
:deep(.van-tabs__line) {
  background: rgb(119, 119, 228);
}
// 商品价格区域
.productHeader {
  margin-bottom: 10px;
  :deep(.van-cell__title) {
    .price {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 28px;
        font-weight: 700;
      }
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      // 标题区域超出隐藏
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 5px 0 10px;
    }
    .van-cell__label {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
    }
  }
}
// 商品规格区域
.productSelect {
  margin-bottom: 10px;
}

/* ********第二个van-tap区域：评论*********** */
.comment {
  margin-bottom: 10px;
}
</style>
