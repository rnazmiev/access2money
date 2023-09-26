export function setClient (state, payload) {
  state.client = payload
}

export function logout (state) {
  state.client = null
}
