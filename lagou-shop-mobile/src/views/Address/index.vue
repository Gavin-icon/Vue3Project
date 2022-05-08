<template>
  <!-- 顶部导航 -->
  <van-nav-bar :title="titleName" left-arraw left-text="返回" @click-left="goBack" />
  <!-- 表单 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 1.姓名 -->
      <van-field
        v-model="real_name"
        name="姓名"
        label="姓名"
        placeholder="收货人姓名"
        :rules="[
          { required: true, message: '请输入收货人姓名' }
        ]"
      />
      <!-- 2.电话 -->
      <van-field
        v-model="phone"
        name="手机"
        label="手机"
        placeholder="收货人手机号"
        :rules="[
          { required: true, message: '请输入收货人手机号' },
          { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
        ]"
      />
      <!-- 3.地区选择,选择完毕后显示的地址 -->
      <van-field
        v-model="fieldValue"
        is-link
        readonly
        label="地区"
        placeholder="请选择所在地区"
        @click="show = true"
        :rules="[
          { required: true, message: '请选择地区' }
        ]"
      />
      <!-- 4.详细地址 -->
      <van-field
        v-model="detail"
        name="详细地址"
        label="详细地址"
        placeholder="详细地址信息"
        :rules="[
          { required: true, message: '请输入详细地址信息' }
        ]"
      />
      <!-- 地区选择弹出层 -->
      <van-popup v-model:show="show" round position="bottom">
        <van-cascader
          v-model="area"
          title="请选择所在地区"
          :options="options"
          :field-names="fieldNames"
          @close="show = false"
          @finish="onFinish"
        />
      </van-popup>
    </van-cell-group>
    <!-- 开关 -->
    <van-cell-group inset>
      <!-- input-align是vant组件提供的输入框默认对齐方式 -->
      <van-field name="switch" label="设为默认地址" class="switch" input-align="right">
        <template #input>
          <van-switch v-model="is_default" size="20" />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
// 引入接口
import { getAddressInfo, addOrEditAddress } from '@/api/address'
// 引入组合式API
import { computed, ref } from '@vue/reactivity'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
const router = useRouter()
const { cartId } = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  cartId: String
})
// --------------------声明响应式数据
// eslint-disable-next-line camelcase
const real_name = ref('')
const phone = ref('')
const area = ref('')
const detail = ref('')
// eslint-disable-next-line camelcase
const is_default = ref(false)
// 地区显示状态
const show = ref(false)
// 地区显示内容
const fieldValue = ref('')
// 选项列表，children 代表子选项，支持多级嵌套
const options = ref([
  // {
  //   text: '浙江省',
  //   value: '330000',
  //   children: [{ text: '杭州市', value: '330100' }]
  // },
  // {
  //   text: '江苏省',
  //   value: '320000',
  //   children: [{ text: '南京市', value: '320100' }]
  // }
])
// 配置组件options的自定义字段名
const fieldNames = {
  text: 'n',
  value: 'v',
  children: 'c'
}
// 将地区选择的信息存储
// eslint-disable-next-line no-unused-vars
const address = ref({})

// --------------------声明computed计算属性
const isEdit = computed(() => router.currentRoute.value.query.isEdit)
const titleName = computed(() => isEdit.value ? '编辑收货人信息' : '新增收货人信息')
const submitId = computed(() => isEdit.value ? router.currentRoute.value.query.editId : 0)

// --------------------声明函数
const goBack = () => {
  history.back()
}
const onSubmit = async () => {
  const { data } = await addOrEditAddress({
    // eslint-disable-next-line camelcase
    real_name: real_name.value,
    phone: phone.value,
    address: address.value,
    // 新增操作设置id为0 , 其他值表示是编辑操作
    id: submitId.value,
    // eslint-disable-next-line camelcase
    is_default: is_default.value,
    detail: detail.value
  })
  console.log(address.value)
  if (data.status !== 200) {
    Toast(data.msg + '请手动修改收获地址')
    return false
  }
  // 返回订单页面,跳转到Address页面时，如果没有cartID，说明是单纯的修改数据，则返回cart页面，如果有，则说明用户修改/新增地址，返回订单页面
  if (cartId) {
    router.push({
      // path: router.currentRoute.value.query.redirect
      name: 'order-confirm',
      params: {
        cartId
      }
    })
  } else {
    router.push('/cart')
  }
}
// 处理地区选择的数据
const processData = data => {
  data.forEach(item => {
    if (item.c.length === 0) {
      // 说明找到了空的属性,组件要求去掉c
      delete item.c
    } else {
      // 如果是省、市，继续递归
      processData(item.c)
    }
  })
  return data
}
// 地址选择区域 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ selectedOptions }) => {
  show.value = false
  console.log(selectedOptions)
  fieldValue.value = selectedOptions.map((option) => option.n).join('🙂')
  // 为提交接口提供数据
  address.value = {
    province: selectedOptions[0].n,
    city: selectedOptions[1].n,
    city_id: selectedOptions[1].v,
    district: selectedOptions[2].n
  }
  console.log(address.value)
}
// --------------------接口数据获取
// 获取后台的地址信息
const initAddressInfo = async () => {
  const { data } = await getAddressInfo()
  // console.log(data)
  console.log('数据获取成功！')
  if (data.status !== 200) {
    return false
  }
  options.value = processData(data.data)
}
initAddressInfo()

// 如果是编辑页面需要将数据填充
const editInfo = () => {
  if (isEdit.value) {
    /* eslint-disable */
    const edit_info = router.currentRoute.value.query
    real_name.value = edit_info.name
    phone.value = edit_info.tel
    fieldValue.value = edit_info.address
    address.value = edit_info.address
    is_default.value = Boolean(edit_info.isDefault)
    /* eslint-enable */
  }
}
editInfo()
</script>

<style lang="scss" scoped>
.van-form {
  padding-top: 5px;
  background-color: #f7f7f7;
  .van-cell-group {
    margin-top: 10px;
  }
}
</style>
