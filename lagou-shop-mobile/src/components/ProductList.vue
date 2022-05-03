<template>
  <van-grid
    class="product-list"
    :column-num="2"
    gutter="15"
    :center="false"
    :border="false"
  >
    <van-grid-item
      v-for="item in productsData"
      :key="item.id"
      :to="{
        name: 'product',
        params: {
          productId: item.id
        }
      }"
    >
      <!-- 商品图 -->
      <van-image
        :src="item.image"
        height="165"
      />
      <!-- 商品标题 -->
      <p
        class="title"
        v-text="item.store_name"
      />
      <!-- 商品价格 -->
      <p
        class="price"
        v-text="item.price"
      />
      <!-- 销量 -->
      <p class="sales">
        已售 {{ item.sales }}件
      </p>
    </van-grid-item>
  </van-grid>
</template>

<script setup>
const { productsData } = defineProps({
  productsData: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.product-list {
  margin: 10px 0;

  :deep(.van-grid-item__content) {
    // 设置不生效，说明内部元素超出
    border-radius: 10px;
    // 设置子元素超出隐藏
    overflow: hidden;
    margin-bottom: 10px;
    padding: 0;

    .title {
      font-size: 14px;
      padding: 5px 8px 0;
      // 设置多行超出隐藏
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      // 子元素从上到下排列：box-orient:vertical / horizontal
      -webkit-box-orient: vertical;
      // 设置允许的行数
      -webkit-line-clamp: 2;
    }

    .price {
      color: #ee3e3e;
      font-size: 22px;
      font-weight: 700;
      padding-left: 6px;
    }

    .sales {
      color: #ccc;
      font-size: 14px;
      padding-left: 8px;
    }
  }
}
</style>
