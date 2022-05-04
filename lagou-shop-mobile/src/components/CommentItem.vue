<template>
  <van-cell class="comment-detail">
    <!-- 1.用户信息 -->
    <div class="user-info">
      <img :src="reply?.avatar" alt="">
      <span class="nickname" v-text="reply?.nickname" />
      <van-rate v-model="commentRate" size="12px" readonly />
    </div>
    <!-- 2.商品信息与时间 -->
    <p class="time" v-text="replyTime" />
    <!-- 3.评价内容 -->
    <p class="comment-content" v-text="reply?.comment" />
    <!-- 4.评价图片列表 -->
    <ul class="picture">
      <li v-for="(item, index) in pics" :key="index">
        <img :src="item" alt="">
      </li>
    </ul>
  </van-cell>
</template>

<script setup>
import { computed } from '@vue/reactivity'
const { reply } = defineProps({
  reply: {
    type: Object,
    required: true
  }
})
// 商品评价星级
const commentRate = computed(() => Number(reply?.star))
// 图片列表
const pics = computed(() => reply?.pics)
// 评论时间
const replyTime = computed(() => `${reply?.add_time},${reply?.sku}`)
</script>

<style lang="scss" scoped>
.comment-detail {
  padding: 10px 15px 20px;

  .user-info {
    font-size: 13px;
    display: flex;
    align-items: center;
    padding: 7px 0;

    img {
      width: 28px;
      height: 28px;
    }

    .nickname {
      padding: 0 10px 0 6px;
    }
  }

  .time {
    font-size: 12px;
    color: #82848f;
    padding: 5px 0;
  }

  .comment-content {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .picture {
    li {
      float: left;
      padding-right: 8px;

      img {
        width: 78px;
        height: 78px;
      }
    }
  }
}
</style>
