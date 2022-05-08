import request from '@/utils/request'

export const payType = (orderKey, data) => request({
  method: 'POST',
  url: `/order/create/${orderKey}`,
  data
})
