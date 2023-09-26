import * as Sentry from '@sentry/vue'
export function sendSentry (error) {
  Sentry.captureException(error)
}
