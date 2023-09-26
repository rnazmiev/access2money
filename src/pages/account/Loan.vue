<template>
  <div v-if="loan">
    <div class="title content_title">Заявка №{{ loan.id }} ({{ loan.status.name}})</div>
    <div class="cabinet_steps">
      <div v-bind:class="{'active' : ['checking_sign', 'wating_sign'].includes(loan.status.code)}">
        <img src="~assets/images/45.svg" alt="">
        <span :class="{loading : loan.status.code === 'checking_sign'}">Проверяем подпись</span>
        <img src="~assets/images/46.svg" alt="" v-if="['transaction', 'active'].includes(loan.status.code)">
      </div>

      <div v-bind:class="{'active' : loan.status.code === 'transaction'}">
        <img src="~assets/images/45.svg" alt="">
        <span :class="{loading : loan.status.code === 'transaction'}">Переводим средства</span>
        <img src="~assets/images/46.svg" alt="" v-if="loan.status.code === 'active'">
      </div>
    </div>
    <div v-if="['active'].includes(loan.status.code)" class="cabinet_items cabinet_items__3">
      <div class="cabinet_item">
        <div class="ras_results active">
          <div class="ras_result">
            <span>Рейтинг:</span>
            <div>{{ primaryScoring.rating_name }}</div>
          </div>
          <div class="ras_result">
            <span>Сумма:</span>
            <div>{{ numberSpace(loan.amount) }} ₽</div>
          </div>
          <div class="ras_result">
            <span>Процент годовых:</span>
            <div>{{ primaryCreditProducts.yearly_percent }} %</div>
          </div>
          <div class="ras_result">
            <span>Регулярный платеж:</span>
            <div>{{ numberSpace(preScoringMonthPay()) }} ₽</div>
        </div>
        </div>
        <div class="content_border">
          Для внесения платежа по займу, переведите сумму согласно графику с расчетного
          счета заемщика на расчетный счет
          № {{ creditCompanyAccountNumber }} указав назначение:
          «Регулярный платеж по договору займа №{{ loanId }} от {{ showDate(loanDate) }}».
        </div>
      </div>
      <div class="cabinet_line"></div>
      <div class="cabinet_item">
        <div class="cabinet_subtitle">График платежей</div>
        <div class="cabinet_table">
        <table>
          <tbody>
            <tr>
              <th>Тело долга</th>
              <th>Проценты</th>
              <th>Дата</th>
              <!-- <th>Статус</th> -->
            </tr>
            <tr
              v-for="(payment,i) in paymentSchedule"
              :key="i"
              >
              <td>{{ numberSpace(payment.body) }} ₽</td>
              <td>{{ numberSpace(payment.interest) }} ₽</td>
              <td>{{ payment.date }}</td>
              <!-- <td><span class="cabinet_table-status active"></span></td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <div v-else class="cabinet_items cabinet_items__2">
      <div class="cabinet_item">
        <div class="cabinet_item-row">
          <div>
            <div class="cabinet_item-title">
              Предварительные условия
              <img src="~assets/images/45.svg" alt="">
            </div>
            <div class="ras_results">
              <div class="ras_result">
                <span>Рейтинг:</span>
                <div>{{ primaryScoring.rating_name }}</div>
              </div>
              <div class="ras_result">
                <span>Сумма:</span>
                <div>{{ numberSpace(primaryCreditProducts.max_amount) }} ₽</div>
              </div>
              <div class="ras_result">
                <span>Процент годовых:</span>
                <div>{{ primaryCreditProducts.yearly_percent }} %</div>
              </div>
              <div class="ras_result">
                <span>Регулярный платеж:</span>
                <div>{{ numberSpace(preScoringMonthPay()) }} ₽</div>
              </div>
            </div>
          </div>
          <div>
            <div class="cabinet_item-title">
              Одобренные условия
              <img src="~assets/images/45.svg" alt="">
            </div>
            <div class="ras_results">
              <div class="ras_result">
                <span>Рейтинг:</span>
                <div>{{ scoring.rating_name }}</div>
              </div>
              <div class="ras_result">
                <span>Сумма:</span>
                <div>{{ numberSpace(loan.amount) }} ₽</div>
              </div>
              <div class="ras_result">
                <span>Процент годовых:</span>
                <div>{{ creditProducts.yearly_percent }} %</div>
              </div>
              <div class="ras_result">
                <span>Регулярный платеж:</span>
                <div>{{ numberSpace(loan.regular_payment) }} ₽</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cabinet_line"></div>
      <div class="cabinet_item">
        <div class="cabinet_subtitle">График платежей</div>
        <div class="cabinet_table">
          <table>
            <tbody>
            <tr>
              <th>Тело долга</th>
              <th>Проценты</th>
              <th>Дата</th>
            </tr>
            <tr
                v-for="(payment,i) in paymentSchedule"
                :key="i">
              <td>{{ numberSpace(payment.body) }} ₽</td>
              <td>{{ numberSpace(payment.interest) }} ₽</td>
              <td>{{ payment.date }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div id="content_border" class="content_border" v-if="['checking_sign', 'wating_sign'].includes(loan.status.code)">
      Для получения займа необходимо подписать
      <a :href="dataPolicyLink" class="link">Пользовательское соглашение</a> и
      <a href="javascript:void(0)" @click="getDocument(loanLink)" class="link">Договор займа</a>, для этого переведите 1 руб.
      с расчетного счета заемщика на расчетный счет № {{ creditCompanyAccountNumber }}, указав назначение:
      «Подписание договора займа №{{ loanId }} от {{ showDate(loanDate) }} и
      <a :href="termsUseLink" class="link">правил платформы access2money</a>».
      После чего нажмите кнопку «Перевод выполнен», в течение 3х рабочих дней средства поступят на ваш расчетный счет.
    </div>
    <div v-else style="margin-top: 10px;height: 10px;width: 100%"></div>
    <div class="button" v-if="['checking_sign', 'wating_sign'].includes(loan.status.code)">
      <a href="javascript:void(0)" @click="sendToSign">Перевод выполнен</a>
    </div>
    <div class="button" style="max-width:350px" v-if="['active', 'close', 'pending', 'transaction'].includes(loan.status.code)">
      <router-link to="my_loans">Вернуться в список</router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'src/utils/axios'
import config from 'src/config'
import { mapGetters } from 'vuex'
import notify from 'src/utils/notify'
import { EventBus } from 'src/event-bus'
import numeral from 'numeral'
import { showDate } from 'src/utils/formatDate'
import { Cookies } from 'quasar'
import { sendSentry } from 'src/utils/sendErrorSentry'

export default defineComponent({
  name: 'Loan',
  data () {
    return {
      primaryScoring: {},
      scoring: {},
      primaryCreditProducts: {},
      creditProducts: {},
      paymentSchedule: [],
      regularPayment: '',
      termsUseLink: `${config.api_url}/documents/public/public_offer`,
      dataPolicyLink: `${config.api_url}/documents/public/privacy_policy`,
      loanLink: '',
      loanId: null,
      loanDate: '',
      loan: null,
      showDate
    }
  },
  computed: {
    ...mapGetters({
      creditCompanyAccountNumber: 'settings/creditCompanyAccountNumber',
      loanAsk: 'loanAsk/loanAsk'
    })
  },
  async created () {
    await this.$store.dispatch('loanAsk/getActiveLoanAsk').then(async (res) => {
      await this.getLoan()
    })
    setInterval(async () => {
      return await api.get('v1/loan/active').then(async (response) => {
        this.loan = response.data.data
      })
    }, 15000)
  },
  methods: {
    async getLoan () {
      return await api.get('v1/loan/active').then(async (response) => {
        this.loan = response.data.data
        this.loanLink = `${config.api_url}${response.data.data.download_url}`
        this.loanId = response.data.data.id
        this.loanDate = response.data.data.created_at
        this.primaryScoring = response.data.data.primaryScoring.data
        this.primaryCreditProducts = response.data.data.primaryScoring.data.credit_products.data.sort((a, b) => {
          return a.max_amount > b.max_amount ? 1 : -1
        })[0]
        this.paymentSchedule = response.data.data.paymentSchedule
        this.regularPayment = response.data.data.paymentSchedule[0].body
        this.creditProducts = response.data.data.scoring.data.credit_products.data[0]
        this.scoring = response.data.data.scoring.data
        return response.data.data
      })
    },
    sendToSign () {
      if (this.loan.status.code === 'checking_sign') {
        return notify.success('Мы уже проверяем вашу подпись договора!')
      }

      EventBus.emit('loading-start')
      api.post('v1/loan/confirm-sign-transaction').then((response) => {
        EventBus.emit('loading-stop')
        notify.success('Договор отправлен на проверку, ожидайте проверки подписи и перевода срдеств!')
        this.getLoan()
      }).catch((e) => {
        EventBus.emit('loading-stop')
        notify.error('Произошла неизвестная ошибка, обратитесь в службу поддержки!')
        sendSentry(e)
      })
    },
    numberSpace (num) {
      return numeral(num).format('0,0').replaceAll(/,/g, ' ')
    },
    preScoringMonthPay () {
      console.log(this.loanAsk.period, 'period')
      const percentMontly = this.primaryCreditProducts.yearly_percent / 12 / 100
      const periodRate = percentMontly / (1 - Math.pow((1 + percentMontly), -1 * this.loanAsk.period))
      return Math.round(parseFloat(this.loan.amount) * periodRate)
    },
    getDocument (link) {
      const token = Cookies.get('api_token')
      var xhr = new XMLHttpRequest()
      xhr.open('GET', link, true)
      xhr.setRequestHeader('Authorization', 'Bearer' + ' ' + token)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function (e) {
        if (this.status === 200) {
          const blob = window.URL.createObjectURL(new Blob([this.response], { type: xhr.getResponseHeader('filetype') }))
          const fileLink = document.createElement('a')
          fileLink.href = blob
          fileLink.target = '_self'
          fileLink.setAttribute('download', xhr.getResponseHeader('filename'))
          document.body.appendChild(fileLink)
          fileLink.click()
        }
      }
      xhr.send()
    }
  }
})
</script>
<style lang="scss">
  .loading {
    &::after {
      overflow: hidden;
      display: inline-block;
      vertical-align: bottom;
      -webkit-animation: ellipsis steps(4,end) 900ms infinite;
      animation: ellipsis steps(4,end) 1500ms infinite;
      content: "\2026";
      width: 0px;
    }
  }

  @keyframes ellipsis {
    to {
      width: 20px;
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 20px;
    }
  }

   #content_border ~ .button:hover {
    background: #001966 !important;
    color: #fff !important;
  }
</style>
