<template>
  <van-cell @click="handleClick(item.order_id)" v-for="(item, index) in orderList" :key="index" class="order-item">
    <img :src="item?.cartInfo[0].productInfo.image" alt="">
    <div class="info">
      <p class="title" v-text="item?.cartInfo[0].productInfo.store_name" />
      <p class="price">
        ￥ {{ item?.cartInfo[0].truePrice }}
        <span class="cart-num">× {{ item?.cartInfo[0].cart_num }}件</span>
      </p>
      <p class="total-price">
        实付款：￥{{ item?.pay_price }}元
      </p>
    </div>
  </van-cell>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const { orderList } = defineProps({
  orderList: {
    type: Array,
    required: true
  }
})

const handleClick = (id) => {
  // console.log(id)
  router.push({
    name: 'order-detail',
    params: {
      orderId: id
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
          padding-left: 8px;
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
</style>
