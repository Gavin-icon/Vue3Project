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
        <van-cell title="共3件" />
      </van-cell-group>
      <!-- 内容区域 -->
      <van-cell-group>
        <!-- 单个商品 -->
        <van-cell class="product">
          <img src="" alt="">
          <div class="info">
            <p class="title">
              华为平板 HUAWEI MatePad11 Pro 10.8 英寸
            </p>
            <p class="price">
              ￥ 3699.00
            </p>
          </div>
          <span class="count">× 3</span>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
  <!-- 立即付款区域 -->
  <van-submit-bar :price="3300" button-text="立即付款" @submit="onSubmit" />
</template>

<script setup>
// 引入接口
import { getAddressList } from '@/api/order'
// 引入组合式API
import { computed, ref, toRaw } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const { cartId } = defineProps({
  cartId: {
    type: String,
    required: true
  }
})
// -----------------响应式数据声明
// 弹出层状态
const popupStatus = ref(false)
// 默认选中的地址--对应list的id
const chosenAddressId = ref('')
const addressList = ref([])
const curAddress = ref({})

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

// -------------声明计算属性
const isEmpty = computed(() => addressList.value.length === 0)

// -------------声明函数
const onSubmit = () => {

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
  // console.log(toRaw(item))
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
}
</style>
