import axios from 'axios'
const request = axios.create({
  baseURL: 'https://shop.fed.lagounews.com/api'
})

export default request
