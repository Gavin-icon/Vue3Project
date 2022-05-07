<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <img :src="userAvatar">
      <div class="user-info">
        <div class="user-name" v-text="userName" />
        <div class="user-id" v-text="userId" />
      </div>
      <van-icon name="setting-o" />
    </div>
    <!-- 主体菜单区域 -->
    <div class="main">
      <van-cell-group inset class="user-detail">
        <van-cell>
          <van-grid :border="false" gutter="0">
            <van-grid-item :text="collectCount">
              <template #icon>
                收藏
              </template>
            </van-grid-item>
            <van-grid-item :text="integral">
              <template #icon>
                积分
              </template>
            </van-grid-item>
            <van-grid-item :text="couponCount">
              <template #icon>
                优惠券
              </template>
            </van-grid-item>
            <van-grid-item :text="nowMoney">
              <template #icon>
                余额
              </template>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset>
        <van-cell title="订单中心" value="查看全部" is-link to="/order" />
        <van-grid :column-num="5" :border="false">
          <van-grid-item icon="bill-o" text="待付款" />
          <van-grid-item icon="tosend" text="待发货" />
          <van-grid-item icon="logistics" text="待收货" />
          <van-grid-item icon="comment-o" text="待评价" />
          <van-grid-item icon="sign" text="已完成" />
        </van-grid>
      </van-cell-group>
    </div>
    <!-- 公告底部 -->
    <layout-footer />
  </div>
</template>

<script setup>
import { getUserInfo } from '@/api/user'
import LayoutFooter from '@/components/LayoutFooter.vue'
import { ref, computed } from 'vue'

const loadUserInfo = async () => {
  const { data } = await getUserInfo()
  console.log(data.data)
  if (data.status !== 200) {
    return false
  }
  userInfo.value = data.data
}
loadUserInfo()

const userInfo = ref({})
// header区域
// 1.头像
const userAvatar = computed(() => userInfo.value?.switchUserInfo?.[0].avatar || 'https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg')
// 2.昵称
const userName = computed(() => userInfo.value?.nickname)
// 3.id
const userId = computed(() => 'ID: ' + (userInfo.value?.uid || ''))
// main区域
const collectCount = computed(() => userInfo.value?.collectCount?.toString() || '')
const integral = computed(() => userInfo.value?.integral?.toString() || '')
const couponCount = computed(() => userInfo.value?.couponCount?.toString() || '')
const nowMoney = computed(() => userInfo.value?.now_money?.toString() || '')
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  padding: 15px 0;
  // background-color: #f6f7f9;
  /* 难点 */
  background: radial-gradient(circle at 50% -10%, #fbc546 72%, #f6f7f9 72%) #f6f7f9 0 -350px no-repeat;
  .header {
    display: flex;
    align-items: center;
    padding: 0 15px 15px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .user-name {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .user-id {
        font-size: 10px;
        margin-top: 8px;
      }
    }
  }
  .main {
    .user-detail {
      // 防止内容没有加载出来导致的高度塌陷
      .van-cell {
        padding: 0;
        min-height: 74px;
      }
    }
  }
}
:deep(.van-icon) {
  font-size: 24px;
}
.van-cell-group {
  margin-bottom: 10px;
}
</style>
