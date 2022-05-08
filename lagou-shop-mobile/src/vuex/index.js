import { createStore } from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import order from './modules/order'
export default createStore({
  modules: {
    user,
    cart,
    order
  }
})
/* --
// 分模块处理后，全局访问时：
* 对于state--> store.state.模块.属性
* 对于getters--> store.getters['模块/属性']
* 对于mutations--> store.commit('模块/方法',参数)
* 对于actions--> store.dispatch('模块/方法',参数)
// 对于模块内部的数据，局部访问时：
* 访问state中的属性时：直接--> state.属性 就可以！！！
*/
