<template>
  <div class="cart-item">
    <!-- 状态选框 -->
    <van-checkbox v-model="isChecked" icon-size="20" checked-color="#ee0a24" />
    <!-- 右侧点击跳转 -->
    <div class="link" @click="handleRouter">
      <!-- 图片区域 -->
      <img
        :src="itemData.image"
        alt=""
      >
      <div class="info">
        <p class="title" v-text="itemData.title" />
        <div class="detail">
          <span class="price">￥ {{ itemData.price }} </span>
          <van-stepper @click.stop v-model="countChange" :max="itemData.stock" min="1" disable-input />
        </div>
        <p class="del" @click.stop>
          <span>删除</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
const router = useRouter()
const store = useStore()
const { itemData } = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})

// 处理函数
const handleRouter = () => {
  return router.push({
    name: 'product',
    params: {
      productId: itemData.productId
    }
    // query: {
    //   redirect: router.currentRoute.value.fullPath
    // }
  })
}

// 处理计算属性
const isChecked = computed({
  get: () => itemData.checked,
  set: newChecked => {
    store.commit('cart/checkedChange', {
      checked: newChecked,
      // 为了找到对应的数据，传递sku的id
      id: itemData.id
    })
  }
})
const countChange = computed({
  get: () => itemData.count,
  set: newCount => {
    store.dispatch('cart/countChange', {
      id: itemData.id,
      count: newCount
    })
  }
})

</script>

<style lang="scss" scoped>
.cart-item {
  height: 90px;
  padding: 10px 20px;
  display: flex;
  // 通过下划线设置间隔线条
  margin-bottom: 1px;
  background-color: #fff;
  .van-checkbox {
    width: 22px;
  }
  .link {
    width: 100%;
    display: flex;
    img {
      width: 88px;
      height: 88px;
      align-self: center;
    }
    .info {
      font-size: 14px;
      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 5px 0 15px;
      }
      .detail {
        margin-bottom: 10px;
        .price {
          font-size: 16px;
          color: #f2270c;
        }
        .van-stepper {
          float: right;
        }
      }
      .del {
        margin-top: 20px;
        direction: rtl;
      }
    }
  }
}
</style>
