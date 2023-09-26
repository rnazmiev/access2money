import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import scoring from './scoring'
import creditProduct from './creditProduct'
import loanAsk from './loanAsk'
import user from './user'
import client from './client'
import settings from './settings'
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      scoring,
      creditProduct,
      loanAsk,
      user,
      client,
      settings
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
