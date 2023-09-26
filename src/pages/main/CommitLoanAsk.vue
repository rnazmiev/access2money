<template>
  <q-page class="flex flex-center">
    <div class="container content_container">
      <div class="ras">
        <div class="title ras_title">Для получения займа необходимо заполнить анкету заемщика</div>
        <div class="progress ras_progress">
          <div class="progress_one" style="width:98%"></div>
          <div class="progress_two">Вероятность одобрения 98%</div>
        </div>
        <div class="ras_tabs">
          <router-link to="/credit_product"><button type="button" class="done">Условия</button></router-link>
          <img src="~assets/images/24.svg" alt="">
          <router-link to="/company_info"><button type="button" class="done">Данные заемщика</button></router-link>
          <img src="~assets/images/24.svg" alt="">
          <button type="button" class="active">Соглашения</button>
        </div>
        <div class="ras_radios">
          <label class="checkbox ras_checkbox">
            <input type="checkbox" v-model="loan_contract_approved">
            <span class="checkbox_one"  v-bind:class="{ 'error' : !loan_contract_approved && form_send_tried }"></span>
            <span class="checkbox_two">Согласен с условиями <a href="javascript:void(0)" @click="getDocument">договора займа</a></span>
          </label>
          <!--<label class="checkbox ras_checkbox">
            <input type="checkbox" v-model="bki_approved">
            <span class="checkbox_one"  v-bind:class="{ 'error' : !bki_approved && form_send_tried }"></span>
            <span class="checkbox_two">Предоставляю согласие на запрос в БКИ</span>
          </label>-->
        </div>
        <button type="button" @click="submit" class="button ras_button">Отправить анкету</button>
      </div>
    </div>
  </q-page>
</template>

<script>
import notify from 'src/utils/notify'
import { EventBus } from 'src/event-bus'
import { api } from 'src/utils/axios'
import config from 'src/config'
import { Cookies } from 'quasar'
import { sendSentry } from 'src/utils/sendErrorSentry'

export default {
  name: 'CommitLoanAsk',
  data () {
    return {
      loan_contract_approved: 0,
      bki_approved: 0,
      form_send_tried: true,
      loanLink: ''
    }
  },
  mounted () {
  },
  methods: {
    async submit () {
      this.form_send_tried = true
      if (this.loan_contract_approved !== true) {
        return notify.error('Необходимо дать согласие с условиями договра ')
      }
      EventBus.emit('loading-start')
      return await api.post('/v1/loan_ask/commit', {
        loan_contract_approved: this.loan_contract_approved,
        bki_approved: 1
      }).then(async (res) => {
        EventBus.emit('loading-stop')
        if (res.data.data) {
          this.$router.push('/loan')
        } else {
          return notify.error('Неизвестная ошибка')
        }
      }).catch((e) => {
        EventBus.emit('loading-stop')
        sendSentry(e)
        return notify.error('Неизвестная ошибка')
      })
    },
    getDocument () {
      api.get('v1/loan/active').then(({ data }) => {
        const loanLink = `${config.api_url}${data.data.download_url}`
        const token = Cookies.get('api_token')
        var xhr = new XMLHttpRequest()
        xhr.open('GET', loanLink, true)
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
      })
    }
  }
}
</script>

<style scoped>
.ras_button{
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  height: 60px !important;
}
</style>
