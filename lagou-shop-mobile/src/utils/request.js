import axios from 'axios'
import store from '@/vuex'
import router from '@/router'
const request = axios.create({
  baseURL: 'https://shop.fed.lagounews.com/api'
})
request.interceptors.request.use(config => {
  const { token } = store.state.user
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
    // console.log(config.headers.Authorization)
  }
  return config
})
// router中有前台接口鉴权，后台有登录接口鉴权
request.interceptors.response.use(response => {
  // 后台接口鉴权失败，跳转到登录页面
  if (response.data.status === 410000) {
    router.push({
      name: 'login',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
  }
  return response
})
export default request
