import { EventBus } from 'src/event-bus'
export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    eventLoading (loading) {
      EventBus.on('loading-stop', () => {
        this.loading = false
      })
      EventBus.on('loading-start', () => {
        this.loading = true
      })
    }
  },
  mounted () {
    this.eventLoading(this.loading)
    console.log(this.loading)
  }
}
