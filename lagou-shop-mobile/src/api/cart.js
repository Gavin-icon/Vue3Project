import request from '@/utils/request'

// 加入购物车
export const addToCart = data => {
  return request({
    method: 'POST',
    url: '/cart/add',
    data
  })
}

// 购物车请求列表数据
export const getCartList = params => request({
  method: 'GET',
  url: '/cart/list',
  params
})

// 修改购物车商品数量
export const changeCartItemNum = data => request({
  method: 'POST',
  url: '/cart/num',
  data
})
