import { EventBus } from 'src/event-bus'
export default {
  data () {
    return {
      show502: false,
      showTitle: ''
    }
  },
  methods: {
    eventShow502 (show502) {
      EventBus.on('error502-show', (title) => {
        this.show502 = true
        this.showTitle = title.title
      })
      EventBus.on('error502-hide', () => {
        this.show502 = false
      })
    }
  },
  mounted () {
    this.eventShow502(this.show502)
  }
}
