<template>
  <!-- 顶部导航 -->
  <van-nav-bar
    title="购物车"
  />
  <!-- 购物车列表 -->
  <div class="card-list" v-if="hasItem">
    <cart-item v-for="item in cartList" :key="item.id" :item-data="item" />
  </div>
  <!-- 空组件,购物车为空时，展示内容 -->
  <van-empty v-else description="购物车暂无商品!" />
  <!-- 底部结算区域 -->
  <van-submit-bar :price="totalPrice" button-text="去结算" @submit="onSubmit">
    <van-checkbox v-model="checkedAll" checked-color="#ee0a24">
      全选
    </van-checkbox>
  </van-submit-bar>
  <!-- 公共底部 -->
  <layout-footer />
</template>

<script setup>
import CartItem from './components/CartItem.vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
import { nextTick, ref } from 'vue'
import { useStore } from 'vuex'
// 引入接口
import { getCartList } from '@/api/cart'
import { computed } from '@vue/reactivity'
const store = useStore()
// 初始化购物车
const initCartList = async () => {
  const { data } = await getCartList({})
  // console.log(data)
  if (data.status !== 200) {
    return false
  }
  // 每次存储之前应该先清除store的数据
  store.commit('cart/clear')

  // 为了保证是先清除，后添加，需要设置nextTick函数
  await nextTick()

  data.data.valid.forEach(item => {
    store.commit('cart/addToCart', {
      // payLoad应该包含sku相关的数据信息 {购物车界面所看到的，以及后期需要的}
      id: item.id,
      checked: true,
      image: item.productInfo.image,
      title: item.productInfo.store_name,
      count: item.cart_num,
      price: item.truePrice,
      stock: item.trueStock,
      productId: item.product_id
    })
  })
}
initCartList()

// 计算属性：检测购物车是否为空
const cartList = computed(() => store.state.cart.cartList)
const hasItem = computed(() => cartList.value.length !== 0)
const totalPrice = computed(() => store.getters['cart/totalPrice'] * 100)
// 底部结算区域,,全选处理
const checkedAll = computed({
  get: () => store.getters['cart/checkedAll'],
  set: newChecked => {
    store.commit('cart/changeAll', {
      checked: newChecked
    })
  }
})

const onSubmit = () => {
  console.log('结算')
}
</script>

<style lang="scss" scoped>
.van-nav-bar {
  position: fixed!important;
  width: 100%;
  top: 0;
}
.card-list {
  margin: 50px 0 100px;
  background-color: #f2f2f2;
}
.van-empty {
  margin-top: 60px;
}
.van-submit-bar {
  bottom: 48px;
}
</style>
