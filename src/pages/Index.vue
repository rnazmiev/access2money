<template>
  <q-page class="flex flex-center">
    <section class="big">
      <div class="container big_container">
        <div class="big_left">
          <div class="big_title">
            Займы для малого
            <span class="br">и среднего бизнеса</span>
          </div>
          <form class="big_form">
            <select-inn-autocomlete @commit="commitCompany"></select-inn-autocomlete>
          </form>
          <div class="big_search" v-if="declined">
            К сожалению мы не можем выдать вам займ
          </div>
          <div class="big_result bg" v-if="declined">
            <div class="big_item" v-if="stopFactor">
              <div class="big_one">Стопфактор:</div>
              <div class="big_two">{{ stopFactor.name}}</div>
            </div>
            <div class="big_item" v-else>
              <div class="big_one">Причина:</div>
              <div class="big_two">Ваш рейтинг: "{{ preScoring.rating_name }}" не удовлетворяет условиям займа</div>
            </div>
          </div>
          <div class="big_result" v-if="!declined">
            <div class="big_item">
              <div class="big_one">Ваш рейтинг</div>
              <div class="big_two">
                <span v-if="preScoring">{{ preScoring.rating_name }}</span>
                <span v-else>---</span>
              </div>
            </div>
            <div class="big_item">
              <div class="big_one">Процентная ставка</div>
              <div class="big_two">
                <span v-if="currentCreditProduct">{{ currentCreditProduct.yearly_percent }}</span>
                <span v-else>--</span>
                %
              </div>
            </div>
            <div class="big_item">
              <div class="big_one">Максимальный срок</div>
              <div class="big_two">
                <span v-if="currentCreditProduct">{{ creditProductsMaxPeriodMonth }}</span>
                <span v-else>---</span>
                <span v-if="currentCreditProduct" style="margin-left: 10px">{{ arrange(currentCreditProduct.period_max_months, ['Месяц', 'Месяца', 'Месяцев']) }}</span>
              </div>
            </div>
            <button type="button" class="big_button hover" v-bind:class="{'disabled' : !currentCreditProduct}" @click="scrollToCalculator">
              Подать заявку
              <img src="~assets/images/24.svg" alt="">
            </button>
          </div>
        </div>
        <div class="big_right">
          <img src="~assets/images/13.svg" alt="">
        </div>
      </div>
    </section>
    <section class="mins">
      <div class="container mins_container">
        <div class="title mins_title">Минимальные требования к заемщику</div>
        <div class="mins_items">
          <div class="mins_item">
            <div>
              <img src="~assets/images/15.svg" alt="">
            </div>
            Отсутствие<br>ограничений по<br>расчетному счету
          </div>
          <div class="mins_item">
            <div>
              <img src="~assets/images/14.svg" alt="">
            </div>
            <!-- eslint-disable -->
            Исполнительные <br>производства<br>&#10094; годовой выручки
            <!-- eslint-enable -->
          </div>
          <div class="mins_item">
            <div>
              <img src="~assets/images/18.svg" alt="">
            </div>
            Форма<br>собственности<br>ЮЛ
          </div>
          <div class="mins_item">
            <div>
              <img src="~assets/images/17.svg" alt="">
            </div>
            Налоговый<br>резидент<br>РФ
          </div>
        </div>
      </div>
    </section>
    <section class="how">
      <div class="container how_container">
        <div class="title how_title">Как это работает</div>
        <div class="how_items">
          <div class="how_item">
            <div>Подать<br>заявку</div>
            <span>1</span>
          </div>
          <div class="how_item">
            <div>Дождаться<br>валидации рейтинга</div>
            <span>2</span>
          </div>
          <div class="how_item">
            <div>Выбрать сумму, срок и график гашения</div>
            <span>3</span>
          </div>
          <div class="how_item">
            <div>Подписать документы переводом</div>
            <span>4</span>
          </div>
          <div class="how_item">
            <div>Получить<br>средства</div>
            <span>5</span>
          </div>
          <div class="how_item">
            <div>Не допускать<br>просрочек</div>
            <span>6</span>
          </div>
          <button type="button" class="how_button hover" style="visibility: hidden">
           Так же вы можете посмотреть видеоролик для лучшего ознакомления
            <img src="images/16.svg" alt="">
          </button>
        </div>
      </div>
    </section>

    <section class="calc">
      <credit-calculator-frame v-if="!declined" @commit-by-inn="commitByInn" :company="company_name"></credit-calculator-frame>
    </section>

    <section class="completed" style="display: none">
      <div class="container completed_container">
        <div class="title completed_title">Выданные займы</div>
        <div class="completed_slick">
          <div>
            <div class="completed_slide">
              <div class="completed_subtitle">ООО «Калита»</div>
              <div class="completed_item">
                <img src="~assets/images/23.svg" alt="">
                <div class="completed_text">30% готовых</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/22.svg" alt="">
                <div class="completed_text">На 200 дней</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/21.svg" alt="">
                <div class="completed_text">Рейтинг В</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/20.svg" alt="">
                <div class="completed_label">Выдано:</div>
                <div class="completed_text">10 000 000</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/19.svg" alt="">
                <div class="completed_label">Статус:</div>
                <div class="completed_text">Погашен</div>
              </div>
            </div>
          </div>
          <div>
            <div class="completed_slide">
              <div class="completed_subtitle">ИП Романова К.А.</div>
              <div class="completed_item">
                <img src="~assets/images/23.svg" alt="">
                <div class="completed_text">30% готовых</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/22.svg" alt="">
                <div class="completed_text">На 200 дней</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/21.svg" alt="">
                <div class="completed_text">Рейтинг ААА</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/20.svg" alt="">
                <div class="completed_label">Выдано:</div>
                <div class="completed_text">10 000 000 000</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/19.svg" alt="">
                <div class="completed_label">Статус:</div>
                <div class="completed_text">Выдан</div>
              </div>
            </div>
          </div>
          <div>
            <div class="completed_slide">
              <div class="completed_subtitle">ООО «Калита»</div>
              <div class="completed_item">
                <img src="~assets/images/23.svg" alt="">
                <div class="completed_text">30% готовых</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/22.svg" alt="">
                <div class="completed_text">На 200 дней</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/21.svg" alt="">
                <div class="completed_text">Рейтинг В</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/20.svg" alt="">
                <div class="completed_label">Выдано:</div>
                <div class="completed_text">10 000 000</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/19.svg" alt="">
                <div class="completed_label">Статус:</div>
                <div class="completed_text">Погашен</div>
              </div>
            </div>
          </div>
          <div>
            <div class="completed_slide">
              <div class="completed_subtitle">ИП Романова К.А.</div>
              <div class="completed_item">
                <img src="~assets/images/23.svg" alt="">
                <div class="completed_text">30% готовых</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/22.svg" alt="">
                <div class="completed_text">На 200 дней</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/21.svg" alt="">
                <div class="completed_text">Рейтинг ААА</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/20.svg" alt="">
                <div class="completed_label">Выдано:</div>
                <div class="completed_text">10 000 000 000</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/19.svg" alt="">
                <div class="completed_label">Статус:</div>
                <div class="completed_text">Выдан</div>
              </div>
            </div>
          </div>
          <div>
            <div class="completed_slide">
              <div class="completed_subtitle">ООО «Калита»</div>
              <div class="completed_item">
                <img src="~assets/images/23.svg" alt="">
                <div class="completed_text">30% готовых</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/22.svg" alt="">
                <div class="completed_text">На 200 дней</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/21.svg" alt="">
                <div class="completed_text">Рейтинг В</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/20.svg" alt="">
                <div class="completed_label">Выдано:</div>
                <div class="completed_text">10 000 000</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/19.svg" alt="">
                <div class="completed_label">Статус:</div>
                <div class="completed_text">Погашен</div>
              </div>
            </div>
          </div>
          <div>
            <div class="completed_slide">
              <div class="completed_subtitle">ИП Романова К.А.</div>
              <div class="completed_item">
                <img src="~assets/images/23.svg" alt="">
                <div class="completed_text">30% готовых</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/22.svg" alt="">
                <div class="completed_text">На 200 дней</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/21.svg" alt="">
                <div class="completed_text">Рейтинг ААА</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/20.svg" alt="">
                <div class="completed_label">Выдано:</div>
                <div class="completed_text">10 000 000 000</div>
              </div>
              <div class="completed_item">
                <img src="~assets/images/19.svg" alt="">
                <div class="completed_label">Статус:</div>
                <div class="completed_text">Выдан</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-page>
  <q-dialog ref="countDowndialogRef" v-model="showCowntdownDialog">
    <q-card class="prescoring-modal" style="display: inline-block; max-width: 640px">
      <q-card-section>
        <h5>Готовим предварительные условия</h5>
      </q-card-section>
      <q-card-section>
        <Countdown
            :deadlineISO="deadline.utc().toISOString()"
            :showDays="false"
            countdownSize="2em"
            :labels="{days: 'Дней',hours: 'Часов',minutes: 'Минут',seconds: 'Секунд'}"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Отмена" @click="cancelPrescoring" v-close-popup />

      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import SelectInnAutocomlete from 'components/Common/elements/SelectInnAutocomlete'
import CreditCalculatorFrame from 'components/Frames/CreditCalculator'
import { mapGetters } from 'vuex'
import { scroll } from 'quasar'
import scoringMixin from 'src/mixins/scoring'
import notify from 'src/utils/notify'
import { api } from 'src/utils/axios'
import { arrange } from 'src/utils/helpers'
import { EventBus } from 'src/event-bus'
import { useRoute } from 'vue-router'
import { sendSentry } from 'src/utils/sendErrorSentry'

const { getScrollTarget, setVerticalScrollPosition } = scroll
export default defineComponent({
  name: 'PageIndex',
  mixins: [scoringMixin],
  components: {
    SelectInnAutocomlete,
    CreditCalculatorFrame
  },
  setup () {
    const route = useRoute()
    return {
      route
    }
  },
  data () {
    return {
      company_name: null
    }
  },
  computed: {
    ...mapGetters({
      stopFactor: 'scoring/preScoringStopFactor',
      approved: 'scoring/preScoringApproved',
      declined: 'scoring/preScoringDeclined',
      creditProduct: 'creditProduct/creditProducts',
      currentCreditProduct: 'creditProduct/currentCreditProduct',
      creditProductsMaxPeriodMonth: 'creditProduct/creditProductsMaxPeriod'
    })
  },
  mounted () {
    if (this.route.params.scroll === 'calculator') {
      this.scrollToCalculator()
    }
  },
  methods: {
    cancelPrescoring () {
      this.showCowntdownDialog = false
      localStorage.removeItem('prescoringRequestProcessing')
      localStorage.removeItem('prescoringRequestProcessingDedline')
    },
    commitCompany (companyData) {
      this.commitPrescoringRequest(companyData.inn)
      console.log(companyData, 'companyData')
      this.company_name = companyData.name
    },
    commitByInn (inn) {
      EventBus.emit('loading-start')
      api.get('/v1/dadata/company-info/' + inn).then(({ data }) => {
        EventBus.emit('loading-stop')
        this.company_name = data.data.name
        this.commitPrescoringRequest(inn)
      }).catch((e) => {
        sendSentry(e)
        return notify.error('Компании с указанным ИНН не найдено')
      })
    },
    scrollToCalculator () {
      const el = document.getElementById('creditCalculator')
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 400
      setVerticalScrollPosition(target, offset, duration)
    },
    arrange (digits, words) {
      return arrange(digits, words)
    }
  }
})
</script>
<style lang="scss" scoped>
  .big_button.disabled {
    color:#ccc;
  }
  .prescoring-modal {
    padding: 20px;
  }
</style>
