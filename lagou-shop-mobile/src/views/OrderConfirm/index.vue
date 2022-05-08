<template>
  <!-- 导航区域 -->
  <van-nav-bar title="订单确认页" left-arrow left-text="返回" @click-left="goBack" />
  <!-- 主体内容 -->
  <div class="container">
    <!-- 地址区域 -->
    <div class="address-card" @click="triggerPopup">
      <div class="info">
        <span v-text="curAddress.name" />
        <span v-text="curAddress.tel" />
      </div>
      <div class="detail">
        <span class="default" v-if="curAddress.isDefault">默认</span>
        <span v-text="curAddress.address" />
      </div>
    </div>
    <!-- 弹出层 -->
    <van-popup v-model:show="popupStatus" position="bottom">
      <!-- 地址栏 -->
      <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @click-item="onClickItem"
      >
        <!-- 无地址的化设置empty -->
        <template #top v-if="isEmpty">
          <van-empty description="暂无收货地址，请添加!" />
        </template>
      </van-address-list>
    </van-popup>
    <!-- 商品列表区域 -->
    <div class="product-list">
      <!-- 标题区域 -->
      <van-cell-group>
        <van-cell :title="`共${ singleOrderNum }件`" class="total-title" />
      </van-cell-group>
      <!-- 内容区域 -->
      <van-cell-group>
        <!-- 单个商品 -->
        <van-cell class="product" v-for="item in cartInfo" :key="item.id">
          <img :src="item.productInfo.image" alt="">
          <div class="info">
            <p class="title" v-text="item.productInfo.store_name" />
            <p class="price">
              ￥ {{ item.truePrice }}
            </p>
          </div>
          <span class="count">× {{ item.cart_num }} </span>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
  <!-- 立即付款区域 -->
  <van-submit-bar :price="toal_price" button-text="立即付款" @submit="onSubmit" />
  <!-- 立即付款弹窗界面 -->
  <van-action-sheet class="pay-out" v-model:show="popupPayStatus" title="请选择付款方式：">
    <van-radio-group v-model="checked">
      <van-cell-group>
        <van-icon name="chat" size="26" />
        <van-cell clickable @click="checked = 'weChat'" title="微信支付" label="微信快捷支付">
          <template #right-icon>
            <van-radio name="weChat" checked-color="#ee0a24" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group>
        <van-icon name="passed" size="26" />
        <van-cell clickable @click="checked = 'aliPay'" title="支付宝支付" label="支付宝快捷支付">
          <template #right-icon>
            <van-radio name="aliPay" checked-color="#ee0a24" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group>
        <van-icon name="refund-o" size="26" />
        <van-cell clickable @click="checked = 'yue'" title="余额支付" :label="`可用余额为：${now_money}元`">
          <template #right-icon>
            <van-radio name="yue" checked-color="#ee0a24" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-button type="danger" block round text="立即支付" @click="goPay" />
    <van-cell-group class="cancel">
      <van-cell title="取消" clickable @click="goCancel" />
    </van-cell-group>
  </van-action-sheet>
</template>

<script setup>
// 引入接口
import { getAddressList, confirmOrder } from '@/api/order'
import { payType } from '@/api/pay'
// 引入组合式API
import { computed, ref, toRaw } from '@vue/reactivity'
import { useRouter } from 'vue-router'
// 引入组件
import { Toast } from 'vant'
const router = useRouter()
const { cartId, newOfPay } = defineProps({
  cartId: {
    type: String,
    required: true
  },
  // eslint-disable-next-line vue/require-default-prop
  newOfPay: {
    type: String,
    required: false
  }
})
// -----------------响应式数据声明
// 弹出层状态
const popupStatus = ref(false)
const popupPayStatus = ref(false)
// 默认选中的地址--对应list的id
const chosenAddressId = ref('')
const addressList = ref([])
const curAddress = ref({})
const confirmOrderInfo = ref({})
const checked = ref('yue')
// -------------接口数据获取
const initAddressList = async () => {
  const { data } = await getAddressList({
    limit: 5,
    page: 1
  })
  if (data.status !== 200) { return false }
  console.log('地址列表获取成功!')
  // 通过map返回一个新数组，内部重新设置对象格式
  addressList.value = convert(data.data)
}
initAddressList()
const _newOfPay = computed(() => newOfPay === '1' ? 1 : 0)

const initConfirmOrder = async () => {
  const { data } = await confirmOrder({
    cartId,
    new: _newOfPay.value
  })
  console.log(data)
  if (data.status !== 200) {
    return false
  }
  confirmOrderInfo.value = data.data
}
initConfirmOrder()

// -------------声明计算属性
const isEmpty = computed(() => addressList.value.length === 0)
const cartInfo = computed(() => confirmOrderInfo.value?.cartInfo)
const addressInfo = computed(() => confirmOrderInfo.value?.addressInfo)
const orderKey = computed(() => confirmOrderInfo.value?.orderKey)
const singleOrderNum = computed(() => cartInfo.value?.length || 0)
// eslint-disable-next-line camelcase
const now_money = computed(() => confirmOrderInfo.value.userInfo.now_money || 0)
// eslint-disable-next-line camelcase
const toal_price = computed(() => Number(confirmOrderInfo.value?.priceGroup?.totalPrice || 0) * 100)
// -------------声明函数
const onSubmit = () => {
  popupPayStatus.value = true
}
const goPay = async () => {
  const { data } = await payType(orderKey.value, {
    addressId: addressInfo.value.id,
    payType: checked.value
  })
  console.log(data)
  if (data.status !== 200) {
    Toast.fail(data.msg)
    return false
  } else {
    Toast.success('购买成功!')
    router.push('/')
  }
}
const goCancel = () => {
  popupPayStatus.value = false
}
const goBack = () => {
  history.back()
}
// 弹出层显示控制
const triggerPopup = () => { popupStatus.value = true }
// 地址栏添加/编辑功能
const onAdd = () => {
  router.push({
    name: 'address',
    query: {
      // redirect: router.currentRoute.value.fullPath,
      isEdit: false
    },
    params: {
      cartId
    }
  })
}
const onEdit = (item) => {
  console.log(toRaw(item))
  router.push({
    name: 'address',
    query: {
      // 跳转后回来，路由重定向
      // redirect: router.currentRoute.value.fullPath,
      isEdit: true,
      editId: item.id,
      name: item.name,
      tel: item.tel,
      address: item.address,
      isDefault: item.isDefault
    },
    params: {
      cartId
    }
  })
}
// 弹出层隐藏 --每个item被选中后的回调，item->address vant所提供
const onClickItem = item => {
  // 弹出层隐藏
  popupStatus.value = false
  // 把选中的数据设置给视图
  // curAddress.value = toRaw(item) --无需这样操作，Vue内部帮我们处理过了
  curAddress.value = item
}
// 数据格式转换
const convert = data => {
  // 通过map，重新返回一个数组
  return data.map(item => {
    const temp = {
      id: item.id,
      name: item.real_name,
      address: item.province + item.city + item.district + item.detail,
      isDefault: item.is_default,
      tel: item.phone
    }
    // 检测当前对象是否是默认对象，我们的接口提供的数据格式，应该按照我们的接口来处理
    if (item.is_default === 1) {
      // 记录勾选的ID
      chosenAddressId.value = item.id
      // 记录当前展示的数据
      curAddress.value = temp
    }
    return temp
  })
}
</script>

<style lang="scss" scoped>
.van-nav-bar {
  position: fixed!important;
  width: 100%;
}
.container {
  padding: 50px 0;
  .address-card {
    font-size: 16px;
    padding: 20px 25px;
    position: relative;
    &::after {
      content: '';
      height: 2px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(90deg, #ff6c6c 0%, #ff6c6c 20%, transparent 20%, transparent 25%, #0084ff 25%, #0084ff 45%, transparent 45%, transparent 50%);
      background-size: 80px;
    }
  }
  .info {
    span:first-child {
      padding-right: 20px;
    }
  }
  .detail {
    .default {
      padding-right: 5px;
      background: #d6251f;
    }
  }
  // 商品列表区域
  .product-list {
    .total-title {
      font-size: 16px;
      font-weight: 700;
    }
    :deep(.product) {
      .van-cell__value {
        display: flex;
        align-items: center;
        img {
          width: 70px;
          height: 70px;
        }
        .info {
          box-sizing: border-box;
          width: 70%;
          padding-right: 15px;
          .title {
            font-size: 16px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .price {
            font-size: 14px;
            color:#d6251f
          }
        }
        .count {
          color: #ccc;
        }
      }

    }
  }
}

.pay-out {
  .van-radio-group {
    .van-cell-group {
      padding: 0 20px;
      display: flex;
      align-items: center;
    }
    .van-cell {
      display: flex;
      align-items: center;
      :deep(.van-cell__title) {
        span {
          font-size: 18px;
          font-weight: 700;
        }
        div {
          font-size: 14px;
          color: rgb(141, 141, 141);
        }
      }
    }
  }
  .van-button {
    width: 88%;
    margin: 0 auto;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .van-cell-group.cancel {
    margin-top: 10px;
    text-align: center;
    font-weight: 700;
    :deep(span) {
      font-size: 15px;
    }
  }
}
</style>
