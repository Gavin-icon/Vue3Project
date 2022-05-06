import request from '@/utils/request'

// 封装登录时，验证码接口
export const getCode = () => request({
  method: 'GET',
  url: '/verify_code'
})
export const getVerifyCode = data => request({
  method: 'POST',
  url: '/register/verify',
  data
})

// 密码登录接口
export const pawLogin = data => request({
  method: 'POST',
  url: '/login',
  data
})
// 验证码登录接口
export const verifyLogin = data => request({
  method: 'POST',
  url: '/login/mobile',
  data
})

// 用户信息接口
export const getUserInfo = () => request({
  method: 'GET',
  url: '/user'
})
