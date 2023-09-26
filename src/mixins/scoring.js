import { Countdown } from 'vue3-flip-countdown'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { EventBus } from 'src/event-bus'

export default {
  components: {
    Countdown
  },
  data () {
    return {
      showCowntdownDialog: false,
      deadline: null
    }
  },
  computed: {
    ...mapGetters({
      preScoring: 'scoring/preScoring',
      preScoringRequest: 'scoring/preScoringRequest'
    })
  },
  mounted () {
    let prescoringRequestProcessing = localStorage.getItem('prescoringRequestProcessing')
    if (prescoringRequestProcessing) {
      prescoringRequestProcessing = JSON.parse(prescoringRequestProcessing)
      const prevScoringDedline = localStorage.getItem('prescoringRequestProcessingDedline')
      this.deadline = moment(prevScoringDedline)
      this.$store.dispatch('scoring/makePreScoringByInn', prescoringRequestProcessing.inn).then((data) => {
        if (data.status === 'processing') {
          this.showCowntdownDialog = true
        } else {
          localStorage.removeItem('prescoringRequestProcessing')
          localStorage.removeItem('prescoringRequestProcessingDedline')
        }
      }).catch(({ response }) => {
        EventBus.emit('error502-show', { title: response.data.message })
      })
    }
  },
  watch: {
    preScoringRequest: {
      handler (newValue) {
        if (newValue.status !== 'processing') {
          this.showCowntdownDialog = false
          localStorage.removeItem('prescoringRequestProcessing')
          localStorage.removeItem('prescoringRequestProcessingDedline')
        }

        if (newValue.status === 'completed') {
          this.$store.dispatch('creditProduct/getCreditProductsByScoring', newValue.pre_scoring.data.id).catch(({ response }) => {
            EventBus.emit('error502-show', { title: response.data.message })
          })
        }
      },
      deep: true
    }
  },
  methods: {
    async makePreScoringByInn (inn) {
      return await this.$store.dispatch('scoring/makePreScoringByInn', inn).then(data => {
        localStorage.setItem('prescoringRequestProcessing', JSON.stringify(data))
        return data
      })
    },
    commitPrescoringRequest (inn) {
      this.deadline = moment().add(10, 'minutes')
      localStorage.setItem('prescoringRequestProcessingDedline', this.deadline)
      this.makePreScoringByInn(inn).then((data) => {
        if (data && data.status === 'processing') {
          this.showCowntdownDialog = true
        }
      })
    }
  }
}
