import { api } from 'src/utils/axios'
import { EventBus } from 'src/event-bus'
import { sendSentry } from 'src/utils/sendErrorSentry'

export function logout () {
  this.commit('user/logout')
  this.commit('loanAsk/logout')
  this.commit('client/logout')
  this.commit('creditProduct/logout')
  this.$router.push('/')
}

export async function verify () {
  return await api.get('/v1/user/profile').then(({ data }) => {
    this.commit('user/setUser', data.data)
    this.commit('client/setClient', data.data.client.data)
    this.commit('creditProduct/setCreditProductsResult', data.data.credit_product.data)
    this.commit('creditProduct/setCurrentCreditProduct', data.data.credit_product.data)
    this.commit('scoring/setPreScoringResult', data.data.pre_scoring.data)
    if (data.data.scoring) {
      this.commit('scoring/setScoringResult', data.data.scoring.data)
    }
    if (data.data.loan_ask) {
      this.commit('loanAsk/setLoanAsk', data.data.loan_ask.data)
    }
    return data
  }).catch((e) => {
    console.log(e)
    sendSentry(e)
  })
}

export async function login ({ commit }, payload) {
  EventBus.emit('loading-start')
  return await api.post('/v1/clients/web/login', payload).then(async (res) => {
    EventBus.emit('loading-stop')
    if (res.data.access_token) {
      api.defaults.headers.common.Authorization = 'Bearer' + ' ' + res.data.access_token
      this.commit('user/setUser', res.data)
    } else {
      return Promise.reject(res.data)
    }
  }).catch((e) => {
    EventBus.emit('loading-stop')
    sendSentry(e)
    return Promise.reject(e.response.data)
  })
}

export async function register ({ commit }, payload) {
  EventBus.emit('loading-start')
  return await api.post('/v1/register', payload).then(async (res) => {
    EventBus.emit('loading-stop')
    if (res.data.data.access_token) {
      api.defaults.headers.common.Authorization = 'Bearer' + ' ' + res.data.data.access_token
      this.commit('user/setUser', res.data.data)
    } else {
      return Promise.reject(res.data.data)
    }
  }).catch((e) => {
    EventBus.emit('loading-stop')
    sendSentry(e)
    return Promise.reject(e.response.data)
  })
}

export async function recover ({ commit }, payload) {
  EventBus.emit('loading-start')
  return await api.post('/v1/password/forgot', { ...payload, reseturl: 'password-reset' }).then(res => {
    EventBus.emit('loading-stop')
  }).catch((e) => {
    EventBus.emit('loading-stop')
    sendSentry(e)
    return Promise.reject(e.response.data)
  })
}
