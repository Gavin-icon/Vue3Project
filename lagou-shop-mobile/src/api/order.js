import request from '@/utils/request'

// 地址信息接口
export const getAddressList = params => request({
  method: 'GET',
  url: '/address/list',
  params
})
