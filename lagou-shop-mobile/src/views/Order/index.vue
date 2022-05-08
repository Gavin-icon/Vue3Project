<template>
  <!-- 导航栏 -->
  <van-nav-bar
    title="订单中心"
    left-text="返回"
    left-arrow
    @click-left="goBack"
  />
  <van-tabs v-model:active="active" swipeable>
    <van-tab title="待付款">
      <order-item :order-list="store.getters['order/obligation']" />
    </van-tab>
    <van-tab title="待发货">
      <order-item :order-list="store.getters['order/tobeShipped']" />
    </van-tab>
    <van-tab title="待收货">
      <order-item :order-list="store.getters['order/tobeReceived']" />
    </van-tab>
    <van-tab title="待评价">
      <order-item :order-list="store.getters['order/tobeReply']" />
    </van-tab>
    <van-tab title="已完成">
      <order-item :order-list="store.getters['order/completed']" />
    </van-tab>
  </van-tabs>
</template>

<script setup>
// 引入组合式API----------------------
import { ref } from '@vue/reactivity'
import { useStore } from 'vuex'

// 引入组件-----------------------
import OrderItem from './components/OrderItem.vue'
import { Toast } from 'vant'
// 引入MOCK API-------------------
import { getOrderList } from '@/api/order'

// 接受数据
const { activeId } = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  activeId: {
    type: [String, Number],
    required: false
  }
})

// 实例化组合式API-----------------
const store = useStore()

// 响应式数据-----------------
const active = ref(Number(activeId))
// 计算属性-------------------

// 函数---------------------
const initOrderList = async () => {
  const { data } = await getOrderList()
  if (data.status !== 200) {
    // eslint-disable-next-line no-undef
    Toast.fail(data.msg)
    return false
  }
  console.log(data)
  active.value = Number(activeId)
  store.commit('order/addOrderList', convert(data.data))
}
initOrderList()

const convert = data => {
  return data.map(item => {
    const temp = {
      _status: item._status,
      order_id: item.order_id,
      cartInfo: item.cartInfo,
      pay_price: item.pay_price
    }
    return temp
  })
}

const goBack = () => {
  history.back()
}
</script>

<style lang="scss" scoped>
</style>
