<template>
  商品详情
</template>

<script setup>
import { getProductDetails } from '@/api/product'
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
const router = useRouter()
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
</script>

<style lang="scss" scoped></style>
