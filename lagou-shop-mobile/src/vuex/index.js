import { createStore } from 'vuex'
export default createStore({
  state () {
    return {
      user: window.localStorage.getItem('USER_TOKEN') || null
    }
  },
  mutations: {
    setUser (state, payLoad) {
      // 防止获取到token后初始化时user内部无信息
      state.user = payLoad
      window.localStorage.setItem('USER_TOKEN', payLoad)
    }
  }
})
