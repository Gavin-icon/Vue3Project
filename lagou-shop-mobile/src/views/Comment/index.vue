<template>
  <van-cell-group class="comment" :border="false">
    <!-- 总体评价区域 -->
    <van-cell title="商品评价" :value="`好评率: ${replyChance}%`" class="all" :border="false" />
    <!-- 标签切换区域 -->
    <van-cell class="tags">
      <!-- 当点击时传递type值，修改响应式数据active，如果state.active === 传递的type ，就让类名显示 -->
      <van-button size="small" :class="{ active: isSum }" @click="tagHandle('0')">
        全部({{ sumCount }})
      </van-button>
      <van-button size="small" :class="{ active: isGood }" @click="tagHandle('1')">
        好评({{ goodCount }})
      </van-button>
      <van-button size="small" :class="{ active: isIn }" @click="tagHandle('2')">
        中评({{ inCount }})
      </van-button>
      <van-button size="small" :class="{ active: isPoor }" @click="tagHandle('3')">
        差评({{ poorCount }})
      </van-button>
    </van-cell>
    <!-- 评价列表区域 -->
    <div v-if="hasComment">
      <comment-item v-for="item in state.commentList" :key="item.id" :reply="item" />
    </div>
    <van-empty v-else description="暂无评论" />
  </van-cell-group>
</template>

<script setup>
// 引入接口
import { getCommentCount, getCommentByTag } from '@/api/product'
import { computed, reactive } from '@vue/reactivity'
// 引入组件
import CommentItem from '@/components/CommentItem.vue'

const { productId } = defineProps({
  productId: {
    type: String,
    required: true
  }
})

// 存储商品信息
const state = reactive({
  // 存储商品信息个数
  commentCounts: {},
  // 存储评价信息
  commentList: [],
  // 控制显示评价状态
  active: '0',
  bodyConstruct: ''
})
// 判断是否存在评论数据
const hasComment = computed(() => state.commentList.length !== 0)
// 通过计算属性，存储各个评论
const goodCount = computed(() => state.commentCounts?.good_count || 0)
const poorCount = computed(() => state.commentCounts?.poor_count || 0)
const inCount = computed(() => state.commentCounts?.in_count || 0)
const sumCount = computed(() => state.commentCounts?.sum_count || 0)
const replyChance = computed(() => state.commentCounts?.reply_chance || 0)
// 设置不同类型的计算属性,返回true/false
const isSum = computed(() => state.active === '0')
const isGood = computed(() => state.active === '1')
const isIn = computed(() => state.active === '2')
const isPoor = computed(() => state.active === '3')
// 处理tagHandle,用于修改样式传递type值：
const tagHandle = (tagKey) => {
  // 修改状态
  state.active = tagKey
  initCommentByTag(tagKey)
}

// 请求商品信息
async function initReplyData () {
  const { data } = await getCommentCount(productId)
  // console.log(data)
  if (data.status !== 200) { return false }
  state.commentCounts = data.data
}
// 请求指定类型的评价
async function initCommentByTag (type) {
  if (type === '3') {
    // 减少请求
    state.commentList = []
    // console.log(state.commentList)
    return false
  }
  const { data } = await getCommentByTag(productId, { type })
  if (data.status !== 200) { return false }
  state.commentList = data.data
}
initReplyData()
// 0-全部 1-好评 2-中评 3-差评
initCommentByTag('0')

</script>

<style lang="scss" scoped>
  .tags {
    .van-button {
      margin-right: 10px;
      border-radius: 15px;
      &.active {
        background-color: #FBC546;
      }
    }
  }
</style>
