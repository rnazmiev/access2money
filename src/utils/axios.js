import axios from 'axios'
import config from 'src/config'
import { Cookies } from 'quasar'

const token = Cookies.get('api_token')
const options = {
  baseURL: config.api_url,
  timeout: 25000,
  headers: {
    withCredentials: true,
    credentials: true
  },
  origin: config.site_url,
  crossDomain: true,
  withCredentials: true,
  credentials: true
}
if (token) {
  options.headers.Authorization = 'Bearer' + ' ' + token
}

var api = axios.create(options)

axios.defaults.withCredentials = true

api.bind()
export {
  api
}
