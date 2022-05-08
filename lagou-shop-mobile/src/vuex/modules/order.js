const state = {
  orderList: []
}
const getters = {
  // 待付款的列表
  obligation: () => {
    return state.orderList.filter(item => item._status._type === 0)
  },
  // 待发货的列表
  tobeShipped: () => {
    return state.orderList.filter(item => item._status._type === 1)
  },
  // 待收货列表
  tobeReceived: () => {
    return state.orderList.filter(item => item._status._type === 2)
  },
  // 待评价列表
  tobeReply: () => {
    return state.orderList.filter(item => item._status._type === 3)
  },
  // 已完成
  completed: () => {
    return state.orderList.filter(item => item._status._type === 4)
  }
}
const mutations = {
  addOrderList (state, payLoad) {
    state.orderList = payLoad
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
