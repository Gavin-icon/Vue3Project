<template>
  <van-cell-group>
    <van-cell @click="handleClick" class="order-item">
      <img :src="productInfo?.image" alt="">
      <div class="info">
        <p class="title" v-text="productInfo?.store_name" />
        <p class="price">
          ￥ {{ cartInfo?.truePrice }}
          <span class="cart-num">× {{ cartInfo?.cart_num }}件</span>
        </p>
        <p class="total-price">
          实付款：￥{{ itemInfo?.pay_price }}元
        </p>
      </div>
    </van-cell>
    <van-cell>
      <div class="address">
        <span>收获信息</span>
        <div class="addressInfo">
          <p class="realName" v-text="realName" />
          <p class="addressName" v-text="addressName" />
        </div>
      </div>
    </van-cell>
    <van-cell>
      <div class="order-num">
        <span>订单编号</span>
        <span class="ord" v-text="itemInfo?.order_id" />
      </div>
    </van-cell>
    <van-cell>
      <div class="time">
        <p>
          订单创建时间：<span v-text="itemInfo?._add_time" />
        </p>
        <p>
          订单支付时间：<span v-text="itemInfo?._pay_time" />
        </p>
        <p>
          订单支付方式：<span v-text="itemInfo?._status?._payType" />
        </p>
      </div>
    </van-cell>
    <van-cell>
      <p>订单发货时间：<span v-text="itemInfo?._status?._msg" /></p>
    </van-cell>
  </van-cell-group>
</template>

<script setup>
import { getOrderInfoById } from '@/api/order'
import { ref, computed } from '@vue/reactivity'
import router from '../../router'

const { orderId } = defineProps({
  orderId: {
    type: String,
    required: true
  }
})

const itemInfo = ref({})
const productInfo = computed(() => itemInfo.value?.cartInfo?.[0].productInfo)
const cartInfo = computed(() => itemInfo.value?.cartInfo?.[0])
const realName = computed(() => itemInfo.value?.real_name + ' ' + itemInfo.value?.user_phone || '')
const addressName = computed(() => itemInfo.value?.user_address || '')

const initOrderInfo = async () => {
  const { data } = await getOrderInfoById(orderId)
  if (data.status !== 200) {
    return false
  }
  console.log(data)
  itemInfo.value = data.data
}
initOrderInfo()

const handleClick = () => {
  router.push({
    name: 'product',
    params: {
      productId: productInfo.value.id
    }
  })
}

</script>

<style lang="scss" scoped>
.order-item {
  :deep(.van-cell__value) {
    display: flex;
    align-items: center;
    margin: 12px 5px;
  }
  .van-cell__value {
    position: relative;
    img {
      width: 70px;
      height: 70px;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        position: absolute;
        left: 70px;
        top: 5px;
        font-size: 18px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .price {
        position: absolute;
        left: 70px;
        bottom: 0;
        font-size: 14px;
        color: rgb(122, 33, 33);
        .cart-num {
          padding-left: 2px;
        }
      }
      .total-price {
        position: absolute;
        font-size: 14px;
        font-weight: 700;
        bottom: 0;
        right: 0;
      }
    }
  }
}

.address {
  .addressInfo {
    float: right;
    text-align: right;
  }
}

.order-num {
  .ord {
    font-size: 10px;
    color: #888888;
    float: right;
    text-align: right;
  }
}

.time {
  font-size: 12px;
  color: rgb(63, 63, 63);
  span {
    float: right;
    font-size: 10px;
    color: #888888;
  }
}
</style>
