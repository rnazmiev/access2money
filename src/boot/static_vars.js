import { boot } from 'quasar/wrappers'

export default boot(({ store, router }) => {
  store.dispatch('settings/getStatcVars').then((data) => {
  })
})
