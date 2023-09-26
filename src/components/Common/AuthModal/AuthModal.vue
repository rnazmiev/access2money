<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" class="">
    <q-card class="modal modal__sign" style="display: inline-block; max-width: 1140px">
      <q-btn class="fancybox-button fancybox-close-small" v-close-popup @click="onCancelClick" />
      <div class="modal_wrapper">
        <div class="modal_toper">
          <button type="button" :class="['modal_toper-1', {active: type === 'register'}]" @click="changeFormType('register')">Зарегистрироваться</button>
          <button type="button" :class="['modal_toper-2', {active: type === 'login'}]" @click="changeFormType('login')">Войти</button>
        </div>
        <div v-if="type === 'recover'" class="modal_tabs">
          <button type="button" class="modal_tab-1">E-mail</button>
        </div>
        <q-form class="modal_form" @submit.prevent="submit">
          <q-input
            debounce="500"
            class="input modal_input"
            v-model="form.email"
            placeholder="Ваш e-mail"
            :model-value="form.email"
            :error="showEmailError"
            :error-message="errors.email"
            type="email"
            dense
            lazy-rules :rules="[ val => val && val.length > 0 || 'Укажите ваш Email', isValidEmail, isAvailableEmail]"
            @update:model-value="updateEmailVerification"
          />
          <q-input
            debounce="500"
            v-if="type === 'login' || type === 'register'"
            class="input modal_input"
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            placeholder="Ваш пароль"
            :model-value="form.password"
            :error="showPasswordError"
            :error-message="errors.password"
            dense
            lazy-rules :rules="[ val => val && val.length >= 6 || 'Пароль должен содержать от 6-ти символов']"
            @update:model-value="updatePasswordVerification"
          >
            <template #append>
              <q-icon
                name="visibility"
                class="cursor-pointer"
                :style="{opacity: showPassword ? 0.3 : 1}"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <q-input
            v-if="type === 'register'"
            debounce="500"
            class="input modal_input"
            v-model="form.phone"
            fill-mask
            mask="+#(###)-###-##-##"
            placeholder="Ваш телефон"
            :model-value="form.phone"
            dense
            :rules="[ phoneRule ]"
          >
          </q-input>
          <label v-if="type === 'register'" class="checkbox modal_checkbox">
            <input type="checkbox" v-model="form.agree" disabled>
            <span class="checkbox_one"></span>
            <span class="checkbox_two">Согласен с <a :href="document.termsUse">правилами платформы</a> и <a :href="document.dataPolicy">политикой обработки персональных данных</a></span>
          </label>
          <div v-if="serverErrorsPlain" class="text-red-5 text-caption q-mt-lg">
              <div v-for="(error, t) in serverErrorsPlain" :key="`error-${t}`">{{error}}</div>
          </div>
          <q-btn
            type="submit"
            class="button modal_button"
            :disable="submitBtnDisabled"
          >
            {{ type === 'register' ? 'Зарегистрироваться' : type === 'recover' ? 'Восстановить' : 'Войти' }}
          </q-btn>
          <q-btn
            v-if="type === 'login'"
            flat
            size="sm"
            class="link modal_link center"
            @click="changeFormType('recover')"
          >
            Забыли пароль?
          </q-btn>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { useDialogPluginComponent } from 'quasar'
import { api } from 'src/utils/axios'
import { isValidEmail } from 'src/utils/mailValidation'
import config from 'src/config'
import { sendSentry } from 'src/utils/sendErrorSentry'

export default {
  name: 'AuthModal',
  emits: [
    ...useDialogPluginComponent.emits
  ],
  props: {
    authType: {
      default: 'login',
      type: String,
      validator: (value) => ['login', 'register', 'recover'].includes(value)
    }
  },
  created () {
    this.type = this.authType
  },
  data () {
    return {
      type: '',
      form: {
        email: '',
        password: '',
        phone: null,
        agree: true
      },
      document: {
        termsUse: `${config.api_url}/documents/public/public_offer`,
        dataPolicy: `${config.api_url}/documents/public/privacy_policy`
      },
      showPassword: false,
      errors: {
        email: '',
        password: ''
      },
      serverErrors: {}
    }
  },
  methods: {
    ...mapActions({
      verify: 'user/verify',
      login: 'user/login',
      register: 'user/register',
      recover: 'user/recover'
    }),
    changeFormType (type) {
      this.type = type
      this.resetErrors()
      this.resetServerErrors()
    },
    submit () {
      const params = {
        email: this.form.email,
        ...(this.type === 'login' || this.type === 'register' ? { password: this.form.password } : {}),
        ...(this.type === 'register' ? { phone: this.normalize(this.form.phone) } : {}),
        ...(this.type === 'register' ? { agree: this.form.agree } : {})
      }
      this[this.type](params).then(() => {
        this.verify()
        this.onDialogOK()
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
    updateEmailVerification (value) {
      this.errors.email = !isValidEmail(value) || ''
      this.resetServerErrors()
    },
    updatePasswordVerification (value) {
      this.errors.password = value && value.length < 6 ? 'Пароль должен содержать от 6-ти символов' : ''
      this.resetServerErrors()
    },
    isAvailableEmail (val) {
      if (this.type === 'register' && val.length > 4 && val.indexOf('@') !== -1) {
        return new Promise((resolve, reject) => {
          api.get('v1/is-email-available/' + val).then(({ data }) => {
            resolve(data.available || 'Пользователь с таким Email уже зарегистрирован')
          })
        })
      }
    },
    resetErrors () {
      this.errors = { email: '', password: '' }
    },
    resetServerErrors () {
      this.serverErrors = {}
    },
    showNotification (message) {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: message
      })
    }
  },
  computed: {
    showPasswordError () {
      return (this.errors && this.errors.password) || (!!this.serverErrors && !!this.serverErrors.password)
    },
    showEmailError () {
      return (this.errors && this.errors.email) || (!!this.serverErrors && !!this.serverErrors.email)
    },
    submitBtnDisabled () {
      return !!this.errors.email || !!this.errors.password
    },
    serverErrorsPlain () {
      const result = []
      this.serverErrors && Object.values(this.serverErrors).forEach(item => {
        item && Object.values(item).forEach(deepItem => {
          result.push(deepItem)
        })
      })
      return result
    }
  },
  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    return {
      dialogRef,
      onDialogHide,
      onOKClick () {
        onDialogOK()
      },
      onDialogOK,
      onCancelClick: onDialogCancel,
      isValidEmail
    }
  }
}
</script>

<style scoped>

</style>
