<template>
  <q-dialog v-model="error502" persistent>
      <div class="errors">
        <div class="errors_left">
          <div class="title errors_one">Ошибка 502</div>
        </div>
        <q-form class="errors_right" @submit.prevent="submit">
          <div class="title errors_title">Связаться с нами</div>
            <q-input
              type="text"
              v-model="form.name"
              :rules="[ val => val && val.length > 0 || 'Укажите ваше имя']"
              class="input errors_input"
              placeholder="Ваше ФИО"
              dense
            />
            <q-input
              debounce="500"
              v-model="form.phone"
              :lazy-rules="false"
              :rules="[ phoneRule ]"
              fill-mask
              mask="+#(###)-###-##-##"
              class="input errors_input"
              placeholder="Ваш телефон"
              dense
            />
            <q-input
              debounce="500"
              v-model="form.email"
              :lazy-rules="false"
              :rules="[ emailRule ]"
              class="input errors_input"
              placeholder="Ваш e-mail"
              dense
            />
            <textarea v-model="form.text" class="textarea errors_textarea" :placeholder="title"></textarea>
            <label class="checkbox errors_checkbox">
              <input type="checkbox" v-model="form.agree">
              <span class="checkbox_one"></span>
              <span class="checkbox_two">Согласен с <a :href="document.termsUse">правилами платформы</a> и
              <a :href="document.dataPolicy">политикой обработки персональных данных</a></span>
            </label>
            <q-btn
              type="submit"
              class="button errors_button"
              label="Отправить"
            />
        </q-form>
        <!-- <q-btn flat label="OK" color="primary" @click="hide"/> -->
      </div>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { EventBus } from 'src/event-bus'
import { isValidEmail } from 'src/utils/mailValidation'
import config from 'src/config'
import { api } from 'src/utils/axios'
import { sendSentry } from 'src/utils/sendErrorSentry'

export default defineComponent({
  name: 'Error502',
  props: {
    showError502: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      error502: this.showError502,
      document: {
        termsUse: `${config.api_url}/documents/public/public_offer`,
        dataPolicy: `${config.api_url}/documents/public/privacy_policy`
      },
      submitBtnDisabled: true,
      form: {
        name: '',
        email: '',
        phone: null,
        text: '',
        agree: true
      }
    }
  },
  methods: {
    hide () {
      EventBus.emit('error502-hide')
    },
    submit () {
      const params = {
        name: this.form.name,
        phone: this.normalize(this.form.phone),
        email: this.form.email,
        text: this.title
      }
      console.log(params)
      api.post('v1/feedback/send', params).then(() => {
        EventBus.emit('error502-hide')
        this.showSuccess()
        this.form = {}
      }).catch(e => {
        this.serverErrors = e.errors
        sendSentry(e)
        if (e.message) {
          this.showNotification(e.message)
        }
      })
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
    emailRule (val) {
      console.log(val)
      if (!val || val.length <= 0) {
        return 'Укажите ваш Email'
      } else {
        return isValidEmail(val)
      }
    },
    showSuccess () {
      this.$q.notify({
        color: 'positive',
        textColor: 'white',
        message: 'Спасибо за обращение в службу поддержки, ваш запрос будет рассмотрен в ближайшее время',
        type: 'positive',
        position: 'center'
      })
    }
  },
  watch: {
    showError502: function (val) {
      this.error502 = val
    }
  }
})
</script>

<style lang="scss">
  .errors {
    display: block;
    background: #fff;
    padding: 50px 20px;
    text-align: center;
    .errors_left {
      width: 100%;
      min-height: auto;
      padding-right: 0;
    }
  }
</style>
