import request from '@/utils/request'

// 地址信息接口
export const getAddressList = params => request({
  method: 'GET',
  url: '/address/list',
  params
})

// 获取确认订单信息
export const confirmOrder = data => request({
  method: 'POST',
  url: '/order/confirm',
  data
})

// 获取订单列表
export const getOrderList = (params) => request({
  method: 'GET',
  url: '/order/list',
  params
})

// 根据订单ID获取订单信息
export const getOrderInfoById = (id) => request({
  method: 'GET',
  url: `/order/detail/${id}`
})
