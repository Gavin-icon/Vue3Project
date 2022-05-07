<template>
  <van-form @submit="onSubmit">
    <!-- 登录图片 -->
    <div class="login_img">
      <img src="https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg">
    </div>
    <!-- 存放表单区域 -->
    <van-cell-group inset>
      <van-field
        v-if="state.isPasswordStatus"
        v-model="state.username" :border="false" clearable name="用户名" label="用户名" placeholder="用户名" :rules="[
          { message: '请输入用户名', required: true },
          { pattern: /^1\d{10}$/, message: '请输入正确的用户名', trigger: 'onBlur' }
        ]"
      />
      <van-field
        v-else
        v-model="state.username" :border="false" clearable name="手机号" label="手机号" placeholder="手机号" :rules="[
          { message: '请输入手机号', required: true },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'onBlur' }
        ]"
      />
      <van-field
        v-if="state.isPasswordStatus"
        v-model="state.password" :border="false" clearable name="密码" label="密码" placeholder="密码" :rules="[
          { message: '请输入密码', required: true },
          { pattern: /^\w{6,8}$/, message: '请输入正确的密码', trigger: 'onBlur' }
        ]"
      />
      <van-field
        v-else
        v-model="state.captcha" center :border="false" clearable label="短信验证码" placeholder="请输入短信验证码" :rules="[
          { message: '请输入验证码', required: true },
          { pattern: /^\w{6}$/, message: '验证码不正确', trigger: 'onBlur' }
        ]"
      >
        <template #button>
          <van-button size="small" type="primary" @click="onVerifyCode" :disabled="state.isSend">
            {{ state.verifyCodeAndTime }}
          </van-button>
        </template>
      </van-field>
    </van-cell-group>
    <!-- 存放提交按钮 -->
    <div style="margin-top: 20px;" class="sub_button">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
      <span @click="loginType" v-text="state.login_type_text" />
    </div>
  </van-form>
</template>

<script setup>
import { computed } from '@vue/reactivity'
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { useCountDown } from '@vant/use'
import { getCode, getVerifyCode, pawLogin, verifyLogin } from '@/api/user.js'
const route = useRoute()
const router = useRouter()
const store = useStore()
// 声明响应式数据
const state = reactive({
  username: '',
  password: '',
  captcha: '',
  login_type: 'password',
  login_type_text: '快速登录',
  isPasswordStatus: computed(() => state.login_type === 'password'),
  // 是否发送了验证码
  isSend: false,
  // 存储倒计时实例
  countDown: null,
  // 验证码与时间的切换文本
  verifyCodeAndTime: computed(() => state.isSend ? state.countDown ? state.countDown.seconds : '发送验证码' : '发送验证码')
})
const onSubmit = async () => {
  // 用户名检测合法
  const username = state.username.trim()
  const password = state.password.trim()
  const captcha = state.captcha.trim()
  // 同意保存登录后的返回数据
  let data = ''
  // 密码登录
  if (state.isPasswordStatus) {
    if (!/^1\d{10}$/.test(username)) {
      return Toast.fail('用户名不合法!')
    }
    if (!/^\w{6,8}/.test(password)) {
      return Toast.fail('密码格式不合法')
    }
    ({ data } = await pawLogin({
      account: username,
      password
    }))
    if (data.status !== 200) {
      Toast.fail(data.msg)
    }
    Toast.success(data.msg)
  } else {
    if (!/^1\d{10}$/.test(username)) {
      return Toast.fail('手机号不合法!')
    }
    if (!/^\d{6}/.test(captcha)) {
      return Toast.fail('验证码不正确')
    }
    ({ data } = await verifyLogin({
      phone: username,
      captcha
    }))
    if (data.status !== 200) {
      Toast.fail(data.msg)
    }
    Toast.success(data.msg)
  }
  console.log(data)
  // 存储token信息
  store.commit('user/setUser', data.data.token)
  router.push({ path: route.query.redirect ?? '/user' })
}
const loginType = () => {
  state.login_type = state.login_type === 'password' ? 'captcha' : 'password'
  state.login_type_text = state.login_type === 'password' ? '快速登录' : '密码登录'
  state.username = ''
  state.password = ''
  state.captcha = ''
}
// 防止重复发送验证码---采用composition API -- vant
const onVerifyCode = async () => {
  state.isSend = true
  // 校验手机号合法性
  if (!/^1\d{10}$/.test(state.username)) {
    Toast.fail('手机号格式不正确')
    state.isSend = false
    return false
  }
  const { data: data1 } = await getCode()
  if (data1.status !== 200) {
    state.isSend = false
    return false
  } else {
    const key = data1.data.key
    const { data: data2 } = await getVerifyCode({
      key,
      phone: state.username,
      type: 'captcha'
    })
    if (data2.status !== 200) {
      Toast.fail('网络开小差了,请稍后再试')
      state.isSend = false
      return false
    } else {
      Toast.success(data2.msg)
      // 设置倒计时实例
      const countDown = useCountDown({
        time: 60 * 1000,
        onFinish () {
          state.isSend = false
        }
      })
      countDown.start()
      // 获取当前剩余时间
      state.countDown = countDown.current
    }
  }
}
</script>

<style lang="scss" scoped>
.van-form {
  height: 100vh;
  background-color: #f7f8fa;
  .login_img {
    text-align: center;
    padding: 35px 0 15px 0;

    img {
      width: 100px;
      height: 100px;
    }
  }
  .sub_button {
    .van-button {
      width: 85%;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
    span {
      display: block;
      text-align: center;
      font-size: 14px;
      color: #999;
      margin-top: 20px;
    }
  }
}
</style>
