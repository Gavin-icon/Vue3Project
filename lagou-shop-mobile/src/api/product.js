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
