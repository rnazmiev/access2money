import { boot } from 'quasar/wrappers'
import { loanClientStepRedirect } from 'src/utils/redirectRules'

export default boot(async ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    if (store.getters['loanAsk/loanAsk']) {
      const loanAsk = store.getters['loanAsk/loanAsk']
      if (to.fullPath === '/') {
        if (loanAsk.client_step > 0) {
          loanClientStepRedirect(router, loanAsk.client_step)
        }
      }
    }
    next()
  })
})
