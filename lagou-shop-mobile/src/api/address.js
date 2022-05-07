import request from '@/utils/request'

// 获取地区信息
export const getAddressInfo = () => request({
  method: 'GET',
  url: '/city_list'
})

// 新增或编辑地址接口
export const addOrEditAddress = data => request({
  method: 'POST',
  url: '/address/edit',
  data
})
