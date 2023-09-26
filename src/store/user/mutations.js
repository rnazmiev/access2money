import { Cookies } from 'quasar'

export function setUser (state, payload) {
  state.user = payload
  if (payload.access_token) {
    state.api_token = payload.access_token
    Cookies.set('api_token', payload.access_token)
  }
}

export function unsetUser (state, payload) {
  state.user = false
}

export function logout (state) {
  Cookies.remove('api_token')
  state.user = null
}
