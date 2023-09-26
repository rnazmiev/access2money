import { Cookies } from 'quasar'

export function isAuthenticated (state) {
  return state.user && Cookies.get('api_token')
}

export function user (state) {
  return state.user
}
