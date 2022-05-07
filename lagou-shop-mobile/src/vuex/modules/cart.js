const state = {
  // 用于存储购物车的数据
  cartList: []
}
const getters = {
  // 筛选选中的商品
  checkedItems: state => {
    return state.cartList.filter(item => item.checked === true)
  },
  // 获取选中商品总价格
  totalPrice: (state, getters) => {
    return getters.checkedItems.reduce((sum, cur) => sum + cur.price * cur.count, 0).toFixed(2)
  },
  // 全选按钮状态
  checkedAll: (state, getters) => {
    // 如果说state中的数据的总长度 与 getters中checkedItems的长度相同，那么就为true，全选框就会为选中状态！
    // 被动式读取，查看选中的个数同全部个数是否一致！
    return state.cartList.length === getters.checkedItems.length
  }
}
const mutations = {
  // -------------购物车功能----------------
  // 全选处理操作,手动操作全选按钮使得每一个购物车的item的选择状态变为 :全选 / 取消
  // 主动式设置， 设置每一个数据的状态
  changeAll (state, { checked }) {
    state.cartList.forEach(item => {
      item.checked = checked
    })
  },
  // 添加商品
  addToCart (state, payLoad) {
    // payLoad应该为包含sku相关信息的对象，具体信息参考state.cardList说明
    state.cartList.push(payLoad)
  },
  // 清空数据，购物车的全部数据
  clear (state) {
    state.cartList = []
  },
  // 修改选中状态
  checkedChange (state, { id, checked }) {
    const currentItem = state.cartList.find(item => item.id === id)
    currentItem.checked = checked
  },
  // 商品个数变化
  countChange (state, { id, count }) {
    state.cartList.find(item => item.id === id).count = count
  }
}
import { changeCartItemNum } from '@/api/cart'
const actions = {
  // countChange (context, { id, count }) {
  //   context.commit('countChange', { id, count })
  // }
  async countChange ({ commit }, { id, count }) {
    commit('countChange', { id, count })
    // eslint-disable-next-line no-unused-vars
    const { data } = await changeCartItemNum({
      id,
      number: count
    })
    console.log('modify number is ok!')
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
