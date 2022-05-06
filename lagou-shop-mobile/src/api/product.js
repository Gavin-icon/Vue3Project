import request from '@/utils/request'

export const getProductsData = params => request({
  method: 'GET',
  url: '/products',
  params
})

export const getProductDetails = id => request({
  method: 'GET',
  url: `/product/detail/${id}`
})

// 商品评价数量请求接口
export const getCommentCount = productId => request({
  method: 'GET',
  url: `/reply/config/${productId}`
})

// 请求不同类型的评论数据
export const getCommentByTag = (productId, params) => request({
  method: 'GET',
  url: `/reply/list/${productId}`,
  params
})
