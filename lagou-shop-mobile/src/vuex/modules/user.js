const state = {
  // 用户信息
  token: window.localStorage.getItem('USER_TOKEN') || null
}
const getters = {

}
const mutations = {
  // 用户功能设置token
  setUser (state, payLoad) {
    // 防止获取到token后初始化时user内部无信息
    state.token = payLoad
    window.localStorage.setItem('USER_TOKEN', payLoad)
  }
}
const actions = {

}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
