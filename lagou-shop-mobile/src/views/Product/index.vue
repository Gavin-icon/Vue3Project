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
          <span>库存：{{ storeInfo?.stock + storeInfo?.unit_name.lastIndexOf('件') !== -1 ? storeInfo?.unit_name :
            storeInfo.unit_name + '件'
          }}</span>
          <span>销量： {{ storeInfo?.fsales }}</span>
        </template>
      </van-cell>
      <!-- 3.商品规格选择区域 -->
      <van-cell class="productSelect" is-link @click="handlePopUp">
        <template #title>
          <span>已选择：{{ sku }} </span>
        </template>
      </van-cell>
      <van-cell>
        <van-popup v-model:show="specState.show" class="popup" position="bottom" :style="{ height: '45%' }">
          <van-cell-group>
            <!-- 1.商品头部信息 -->
            <van-cell class="popupHeader">
              <img :src="skuDetails?.image" alt="">
              <div class="info">
                <p class="title" v-text="storeInfo?.store_name" />
                <p class="price">
                  ￥ {{ skuDetails?.price }}
                </p>
                <p class="stock">
                  库存： {{ skuDetails?.product_stock }}
                </p>
              </div>
            </van-cell>
            <!-- 2.规格区域 -->
            <van-cell class="spec" v-for="(attr, specIndex) in productAttr" :key="attr.id">
              <p> {{ attr.attr_name }} </p>
              <!-- 看哪一个tag标签的名字对应着specSate.spec的数据，对应的显示active类目 -->
              <span
                :class="{ active: specState.spec[specIndex] === tag }"
                class="tag"
                @click="handleTagChange(tag, specIndex)"
                v-for="tag in attr.attr_values" :key="tag"
              > {{ tag }} </span>
            </van-cell>
            <!-- 3.数量 -->
            <van-cell title="数量" class="stepper">
              <van-stepper v-model="value" min="1" max="8" />
            </van-cell>
          </van-cell-group>
        </van-popup>
      </van-cell>
    </van-tab>
    <van-tab title="评价" class="comment">
      <van-cell-group>
        <!-- 1.总体评价区域 -->
        <van-cell
          is-link :title="replyInfo" :value="replyRate" :to="{
            name: 'comment',
            params: {
              productId: productId
            }
          }"
        />
        <!-- 2.评价列表区域 -->
        <comment-item :reply="reply" v-if="replyCount" />
      </van-cell-group>
    </van-tab>
    <van-tab title="推荐">
      <van-cell class="recommend">
        <p class="title">
          推荐商品
        </p>
        <van-grid :border="false" :column-num="3">
          <van-grid-item
            v-for="item in goodsList" :key="item.id" :to="{
              name: 'product',
              params: {
                productId: item.id
              }
            }"
          >
            <img :src="item.image" alt="">
            <p> {{ item.store_name }} </p>
            <span>￥{{ item.price }}</span>
          </van-grid-item>
        </van-grid>
      </van-cell>
    </van-tab>
    <van-tab title="详情">
      <div v-html="storeInfo?.description" class="description" />
    </van-tab>
  </van-tabs>
</template>

<script setup>
import { getProductDetails } from '@/api/product'
import { computed, ref, reactive } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useRouter, onBeforeRouteUpdate, useRoute } from 'vue-router'
// 引入组件
import CommentItem from '@/components/CommentItem.vue'
const router = useRouter()
const route = useRoute()
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
const initProductDetail = async (productId) => {
  const { data } = await getProductDetails(productId)
  // console.log(data)
  if (data.status !== 200) {
    // 找不到对应商品
    return router.push({
      name: 'home'
    })
  }
  productDetails.value = data.data
  // 初始化规格数据，请求一回来就调用
  initSpec(data.data.productAttr)
}
initProductDetail(productId)

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

// 推荐商品信息
const goodsList = computed(() => productDetails.value.good_list)
// 更新列表，防止组件服用不更新页面，重写进入页面的感觉
// onBeforeRouteUpdate((to) => {
//   // 清楚旧的数据
//   productDetails.value = {}
//   // 回到页面顶部
//   document.body.scrollTop = 0
//   document.documentElement.scrollTop = 0
//   // 请求数据
//   initProductDetail(to.params.productId)
// })
watch(() => route.params, (toParams, oldParams) => {
  productDetails.value = {}
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  initProductDetail(toParams.productId)
})

// 商品详情区域
// const descriptionDetails = computed(() => storeInfo?.description)

// 规格弹出层处理
const specState = reactive({
  show: false,
  // 选择的规格的数据，只存储每个productAttr的子项的第一个数据，0 -> 第一个规格 1-> 第二个规格
  spec: []
})
const handlePopUp = () => {
  specState.show = !specState.show
}
// 初始化规格的默认选择数据 形参spec实际上就是productAttr
const initSpec = (spec) => {
  // 取出productAttr中每个选项的第一个参数； 与遍历时productAttr的每个子项的index值对比，如果specState.spec[index] === tag(tag标签遍历后第一个数据)
  // 存储默认值，默认就是每个productAttr中每个选项的第一个参数
  specState.spec = spec.map(item => item.attr_values[0])
}
const handleTagChange = (tag, specIndex) => {
  // 将点击的tag的名称存到对应下表specIndex的specState.spec数组中
  specState.spec[specIndex] = tag
}
// 规格数据处理
const productAttr = computed(() => productDetails.value.productAttr)
const productValue = computed(() => productDetails.value.productValue)
// sku数据处理，选择的数据
const sku = computed(() => specState.spec.toString())
// 根据sku获取对应的商品的数据信息
const skuDetails = computed(() => productValue.value?.[sku.value])
</script>

<style lang="scss" scoped>
// 商品区域整体的背景色
.van-tabs {
  background-color: #f2f2f2;
  width: 375px;
}

/* ********第一个van-tap区域：商品*********** */
// 顶部nav-bar固定，防止后续变化
.van-nav-bar {
  position: fixed !important;
  width: 375px;
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
:deep(.productSelect) {
  margin-bottom: 10px;
}

/* ********第二个van-tap区域：评论*********** */
.comment {
  margin-bottom: 10px;
}

/*  *******第三个van-tap区域：推荐 ********* */
:deep(.recommend) {
  margin-bottom: 10px;

  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 5px 0;
  }

  .van-grid-item {
    img {
      width: 107px;
      height: 107px;
    }

    p {
      padding: 0 3px;
      font-size: 14px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      align-self: flex-start;
    }

    span {
      color: #f2270c;
      font-size: 12px;
      font-weight: 700;
      // css3属性align-self 设置样式
      align-self: flex-start;
    }

    .van-grid-item__content {
      padding: 0;
    }
  }
}

/*  ********第四个区域：详情************* */
:deep(.description) {
  width: 100%;

  img {
    width: 375px;
  }
}

// 弹出层
:deep(.van-popup) {
  border-radius: 10px 10px 0 0;
  max-height: 70%;
  margin-bottom: 50px;
  // 弹框顶部
  .popupHeader {
    .van-cell__value {
      display: flex;
      img {
        width: 75px;
        height: 75px;
        align-self: center;
      }
      .info {
        padding: 10px;
        .title {
          font-size: 16px;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          margin-bottom: 10px;
        }
        .price {
          font-size: 16px;
          color: #f2270c;
        }
        .stock {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  // 规格区域
  .spec {
    p {
      margin-bottom: 5px;
    }
    .tag {
      display: inline-block;
      min-width: 25px;
      padding: 0 12px;
      border: 1px solid #ccc;
      border-radius: 20px;
      text-align: center;
      background-color: #f2f2f2;
      margin-right: 10px;
      &.active {
        border-color: #f2270c;
        color:#f2270c;
        background-color: #fcede8;
      }
    }
  }
  // 数字区域
  .stepper {
    .van-cell__title {
      text-align: left;
    }
  }
}
</style>
