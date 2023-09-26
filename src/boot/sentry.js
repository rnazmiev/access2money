import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import App from 'src/App.vue'
import config from 'src/config'

Sentry.init({
  App,
  dsn: config.sentry_dsn,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0
})
