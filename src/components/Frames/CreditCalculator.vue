<template>
  <div class="container calc_container" id="creditCalculator">
    <div class="title calc_title" v-if="companyName">Предварительные условия для "{{companyName}}"</div>
    <div class="title calc_title" v-else>Кредитный калькулятор</div>
    <div class="calc_level calc_level__1" v-bind:class="{'active' : currentCreditProduct && !client}">
      <q-form class="calc_row a2m-form" v-if="currentCreditProduct"  @submit="submit">
        <div class="calc_left">
          <div class="calc_top">
            <div class="calc_top-item">
              <div class="calc_top-label">Желаемая сумма</div>
              <input type="text" class="input-2" :value="numerial(amount)" @change="changeAmount">
              <q-slider class="a2mslider" v-model="amount" thumb-path="" :min="creditProductsMinAmount" :max="creditProductsMaxAmount"/>
            </div>
            <div class="calc_top-item">
              <div class="calc_top-label">Желаемый срок</div>
              <div class="input-2" style="margin-bottom:25px;" @click="foucsInput">
                <div class="" style="display: flex; width: 100%">
                  <input type="text" class="" style="width: auto" :value="period"  ref="monthsInput" @input="changePeriod">
                    <div class="flex" >{{ arrange(period, ['Месяц', 'Месяца', 'Месяцев']) }}</div>
                </div>
              </div>

              <q-slider class="a2mslider" v-model="period" thumb-path=""  :min="creditProductsMinPeriod" :max="creditProductsMaxPeriod"/>
            </div>
          </div>
          <div class="calc_bot">
            <div class="calc_bot-item">
              <span>Процентная ставка</span>
              <div> {{ currentCreditProduct.yearly_percent }} %</div>
            </div>
            <div class="calc_bot-item">
              <span>Переплата</span>
              <div>{{ numerial(overpay) }} ₽</div>
            </div>
            <div class="calc_bot-item">
              <span>Комиссия платформы</span>
              <div>{{ 0 }} ₽</div>
            </div>
          </div>
        </div>
        <div class="calc_right" v-if="!client">
          <div class="calc_right-top">
            <template v-if="user">
              <div class="calc_right-item">
                <q-input type="text" class="a2m-form-input"  v-model="name" placeholder="ФИО представителя" lazy-rules :rules="[ val => val && val.length > 0 || 'Укажите ваше имя']"></q-input>
              </div>
              <div class="calc_thing">
                <div>E-mail</div>
                <div>{{ user.email }}</div>
              </div>
              <label class="checkbox calc_checkbox">
                <input type="checkbox" v-model="contest">
                <span class="checkbox_one" v-bind:class="{ 'error' : !contest && form_send_tried }"></span>
                <span class="checkbox_two">Согласен с <a :href="document.termsUse" download="public_offer.pdf">правилами платформы</a> и <a :href="document.dataPolicy" download="term_use.pdf">политикой обработки персональных данных</a></span>
              </label>
            </template>
            <template v-else>
              <div class="calc_right-item">
                <q-input type="text" class="a2m-form-input"  v-model="name" placeholder="ФИО представителя" lazy-rules :rules="[ val => val && val.length > 0 || 'Укажите ваше имя']"></q-input>
              </div>
              <div class="calc_right-item">
                <q-input
                  class="a2m-form-input"
                  v-model="phone"
                  fill-mask
                  mask="+#(###)-###-##-##"
                  placeholder="Ваш телефон"
                  :rules="[ phoneRule ]"
                  >
                </q-input>
              </div>
              <div class="calc_right-item">
                <q-input
                  type="email"
                  class="a2m-form-input"
                  v-model="email"
                  placeholder="Ваш e-mail"
                  lazy-rules :rules="[ val => val && val.length > 0 || 'Укажите ваш Email', isValidEmail, isAvailableEmail]"
                  >
                </q-input>
              </div>
              <div class="calc_right-item">
                <q-input :type="isPwd ? 'password' : 'text'" class="a2m-form-input" v-model="password" placeholder="Придумайте пароль" lazy-rules :rules="[ val => val && val.length >= 6 || 'Пароль должен содержать от 6-ти символов']">
                  <template v-slot:append>
                    <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        color="#fff"
                        style="color:#fff"
                        @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
              <label class="checkbox calc_checkbox">
                <input type="checkbox" v-model="contest">
                <span class="checkbox_one" v-bind:class="{ 'error' : !contest && form_send_tried }"></span>
                <span class="checkbox_two">Согласен с <a :href="document.termsUse" download="public_offer.pdf">правилами платформы</a> и <a :href="document.dataPolicy" download="term_use.pdf">политикой обработки персональных данных</a></span>
              </label>
            </template>
          </div>
          <div class="calc_right-bot">
            <div v-if="!user">Подавая заявку, вы будете зарегистрированы. Если вы были зарегистрированы ранее - авторизуйтесь</div>
            <button type="submit" class="hover js-calc-one">Подать заявку</button>
          </div>
        </div>

        <div class="calc_right" v-else>
          <div class="calc_right-top">
            <div class="calc_thing">
              <div>ФИО</div>
              <div>{{ user.name }}</div>
            </div>
            <div class="calc_thing">
              <div>Компания</div>
              <div>{{ user.client.data.company_name }}</div>
            </div>
            <div class="calc_thing" v-if="preScoring">
              <div>Рейтинг</div>
              <div>{{ preScoring.rating_name }}</div>
            </div>
            <label class="checkbox calc_checkbox" style="margin-top: 40px;">
              <input type="checkbox" v-model="contest">
              <span class="checkbox_one" v-bind:class="{ 'error' : !contest && form_send_tried }"></span>
              <span class="checkbox_two">Согласен с <a :href="document.termsUse" download="public_offer.pdf">правилами платформы</a> и <a :href="document.dataPolicy" download="term_use.pdf">политикой обработки персональных данных</a></span>
            </label>
          </div>
          <div class="calc_right-bot" style="padding-top: 40px;">
            <div>Подавая заявку, вы будете зарегистрированы</div>
            <button type="submit"  class="hover js-calc-one">Подать заявку</button>
          </div>
        </div>
      </q-form>
    </div>
    <div class="calc_level calc_level__2" v-bind:class="{'active' : !currentCreditProduct }">
      <form class="calc_body">
        <div>Введите ИНН, что бы узнать свой преварительный рейтинг</div>
        <input type="number" class="input" placeholder="Введите ИНН" v-model="inn">
        <button type="button" class="button js-calc-two" @click="commitCompanyByInnOnly">Отправить</button>
      </form>
    </div>
    <div class="calc_level calc_level__3" v-bind:class="{'active' : loanask}">
      <form class="calc_body">
        <div>Заявка на займ уже есть</div>
        <button @click="showStep" type="button" class="button js-calc-reset">Перейти</button>
      </form>
    </div>
  </div>
  <div id="forWidthCalculate" ref="forWidthCalculate" style="visibility: hidden;position: absolute"> {{ period }}</div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'
import { arrange } from 'src/utils/helpers'
import numeral from 'numeral'
import { api } from 'src/utils/axios'
import scoringMixin from 'src/mixins/scoring'
import notify from 'src/utils/notify'
import { loanClientStepRedirect } from 'src/utils/redirectRules'
import { isValidEmail } from 'src/utils/mailValidation'
import { EventBus } from 'src/event-bus'
import config from 'src/config'

export default defineComponent({
  name: 'CreditCalculator',
  mixins: [scoringMixin],
  props: ['company'],
  setup () {
    return {
      isPwd: ref(true),
      form_send_tried: ref(false),
      isValidEmail
    }
  },
  data () {
    return {
      period: null,
      amount: null,
      contest: null,
      name: '',
      email: '',
      phone: null,
      password: '',
      inn: '',
      document: {
        termsUse: `${config.api_url}/documents/public/public_offer`,
        dataPolicy: `${config.api_url}/documents/public/privacy_policy`
      },
      companyName: this.company | null
    }
  },
  mounted () {
    if (this.client) {
      this.companyName = this.client.data.company_name
      this.makePreScoringByInn(this.client.inn)
    }
  },
  computed: {
    ...mapGetters({
      preScoring: 'scoring/preScoring',
      creditProducts: 'creditProduct/creditProducts',
      creditProductsMinAmount: 'creditProduct/creditProductsMinAmount',
      creditProductsMinPeriod: 'creditProduct/creditProductsMinPeriod',
      creditProductsMaxAmount: 'creditProduct/creditProductsMaxAmount',
      creditProductsMaxPeriod: 'creditProduct/creditProductsMaxPeriod',
      user: 'user/user',
      client: 'client/client',
      loanask: 'loanAsk/loanAsk'
    }),
    currentCreditProduct: {
      get () {
        return this.$store.state.creditProduct.currentCreditProduct
      },
      set (newCreditProduct) {
        this.$store.commit('creditProduct/setCurrentCreditProduct', newCreditProduct)
      }
    },
    overpay () {
      const percentMontly = this.currentCreditProduct.yearly_percent / 12 / 100
      const periodRate = percentMontly / (1 - Math.pow((1 + percentMontly), -1 * this.period))
      const monthPay = Math.round(this.amount * periodRate)
      const periodRateTotal = monthPay * this.period
      return (periodRateTotal - this.amount)
    }
  },
  watch: {
    company (val) {
      this.companyName = val
    },
    currentCreditProduct (val, oldVal) {
      if (!oldVal && val) {
        this.period = this.currentCreditProduct.period_max_months
        this.amount = this.currentCreditProduct.max_amount
        this.$nextTick(() => { this.$refs.monthsInput.style.width = parseInt(this.$refs.forWidthCalculate.offsetWidth) + 10 + 'px' })
      }
    },
    period (newPeriod) {
      this.currentCreditProduct = this.creditProducts.filter((creditProduct) => {
        return newPeriod >= creditProduct.period_min_months && newPeriod <= creditProduct.period_max_months
      }).sort((a, b) => {
        return a.yearly_percent > b.yearly_percent ? 1 : -1
      })[0]
    },
    amount (newAmount) {
      this.currentCreditProduct = this.creditProducts.filter((creditProduct) => {
        return newAmount >= creditProduct.min_amount && newAmount <= creditProduct.max_amount
      }).sort((a, b) => {
        return a.yearly_percent > b.yearly_percent ? 1 : -1
      })[0]
    }
  },
  methods: {
    changePeriod (e) {
      let period = e.target.value

      if (period < this.creditProductsMinPeriod) {
        period = this.creditProductsMinPeriod
      }
      if (period > this.creditProductsMaxPeriod) {
        period = this.creditProductsMaxPeriod
      }

      this.period = period
      e.target.value = period
      this.$refs.forWidthCalculate.textContent = period
      this.$refs.monthsInput.style.width = parseInt(this.$refs.forWidthCalculate.offsetWidth) + 10 + 'px'
    },
    changeAmount (e) {
      let amount = parseFloat(e.target.value.replace(/ /, ''))

      if (amount < this.creditProductsMinAmount) {
        amount = this.creditProductsMinAmount
      }
      if (amount > this.creditProductsMaxAmount) {
        amount = this.creditProductsMaxAmount
      }

      this.amount = amount
      e.target.value = this.numerial(amount)
    },
    commitCompanyByInnOnly () {
      if (this.inn.toString().length !== 10) {
        return notify.error('Инн должно содержать 10 цифр')
      }
      this.$emit('commitByInn', this.inn)
    },
    foucsInput () {
      this.$refs.monthsInput.focus()
    },
    arrange (digits, words) {
      return arrange(digits, words)
    },
    numerial (digits) {
      return numeral(digits).format('0,0').replaceAll(/,/g, ' ')
    },
    isAvailableEmail (val) {
      if (val.length > 4 && val.indexOf('@') !== -1) {
        return new Promise((resolve, reject) => {
          api.get('v1/is-email-available/' + val).then(({ data }) => {
            resolve(data.available || 'Пользоатель с таким Email уже зарегестрирован')
          })
        })
      }
    },
    normalize (phone) {
      phone = phone.replace(/[^\d]/g, '')
      return Number(phone)
    },
    phoneRule (val) {
      if (!val) {
        return 'Введите номер телефона'
      } else {
        const phone = this.normalize(val)
        if (phone.toString().length >= 5) {
          return true
        } else {
          return 'Неверный номер'
        }
      }
    },
    submit () {
      this.form_send_tried = true

      if (this.contest !== true) {
        return notify.error('Необходимо дать согласие с политикой платформы')
      }

      if (this.user) {
        this.$store.dispatch('loanAsk/createLoanAskWithOldUser', {
          name: this.name,
          scoring_id: this.preScoring.id,
          policy_confirmation: this.contest,
          loan_data: {
            credit_product_id: this.currentCreditProduct.id,
            amount: this.amount,
            period: this.period
          }
        }).then((e) => {
          this.$store.dispatch('user/verify').then((data) => {
            EventBus.emit('loading-start')
            this.$router.push('/bank_operations')
          })
        })
      } else {
        this.$store.dispatch('loanAsk/createLoanAskWithNewUser', {
          name: this.name,
          email: this.email,
          phone: this.normalize(this.phone),
          scoring_id: this.preScoring.id,
          password: this.password,
          policy_confirmation: this.contest,
          loan_data: {
            credit_product_id: this.currentCreditProduct.id,
            amount: this.amount,
            period: this.period
          }
        }).then((e) => {
          this.$router.push('/bank_operations').then(() => {
            EventBus.emit('loading-start')
            window.location.reload()
          })
        })
      }
    },
    showStep () {
      loanClientStepRedirect(this.$router, this.loanask.client_step)
    }
  }
})
</script>
<style lang="scss">
  .a2m-form{
    .text-negative {
      color:#ff8585 !important;
    }
    .q-field--error .q-field__bottom {
      color:#ff8585 !important;
    }
  }
  .a2m-form-input{
    &.q-field--standard .q-field__control:before {
      border-bottom: 2px solid #fff !important;
    }
    &.q-field--standard .q-field__control:hover:before{
      border-bottom: 2px solid #e2e2e2 !important;
    }
    &.q-field--standard .q-field__control:after {
      background: #0DDE9F !important;
    }
    input{
      color: #fff !important;
      font-size:18px;
      padding: 0px;
      letter-spacing: normal;
    }

  }
  .a2mslider {
    .q-slider__thumb-container{
      svg{
        width: 24px;
        height: 24px;
        background: url(~assets/images/25.svg) no-repeat;
        position: absolute;
        top: -2px;
        margin-left: 0px;
        cursor: pointer;
      }
    }
    .q-slider--editable:hover{
      opacity: 0;
    }
    .q-slider__focus-ring{
      opacity: 0;
    }
    .q-slider__track{
      background: #0DDE9F;
      height: 4px;
    }
    .q-slider__focus-ring{
      display: none;
    }
  }
</style>
