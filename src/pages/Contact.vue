<template>
    <div class="contact-wrapper">
        <iframe :src="contacts.mapLink" class="map"></iframe>
        <main class="content">
            <div class="container content_container">
                <div class="contacts">
                    <div class="title contacts_title">Наши контакты</div>
                    <div class="contacts_items">
                        <div class="contacts_item">
                            <div class="contacts_name">Название компании</div>
                            <div class="contacts_text">{{ contacts.name }}</div>
                        </div>
                        <div class="contacts_item">
                            <div class="contacts_name">Адрес</div>
                            <div class="contacts_text">{{ contacts.address }}</div>
                        </div>
                        <div class="contacts_item">
                            <div class="contacts_name">Телефон</div>
                            <div class="contacts_text">
                                <a href="tel:+79155852019">{{ contacts.phone }}</a>
                            </div>
                        </div>
                        <div class="contacts_item">
                            <div class="contacts_name">E-mail</div>
                            <div class="contacts_text">
                                <a href="mailto:support@access2money.ru">{{ contacts.email }}</a>
                            </div>
                        </div>
                    </div>
                    <div class="title contacts_title">Реквизиты</div>
                    <div class="contacts_items">
                        <div class="contacts_item">
                            <div class="contacts_name">Генеральный директор</div>
                            <div class="contacts_text">{{ contacts.directorName }}</div>
                        </div>
                        <div class="contacts_item">
                            <div class="contacts_name">ОКВЭД</div>
                            <div class="contacts_text">{{ contacts.okvd }}</div>
                        </div>
                        <div class="contacts_item">
                            <div class="contacts_name">ИНН</div>
                            <div class="contacts_text">{{ contacts.inn }}</div>
                        </div>
                        <div class="contacts_item">
                            <div class="contacts_name">ОГРН</div>
                            <div class="contacts_text">{{ contacts.ogrn }}</div>
                        </div>
                    </div>
                    <div class="title contacts_title">Связаться с нами</div>

                    <q-form
                      @submit.prevent="submit"
                      class="contacts_form"
                    >
                        <div class="contacts_row">
                            <q-input
                                v-model="form.name"
                                class="input contacts_input"
                                placeholder="ФИО представителя"
                                dense
                            />
                            <q-input
                                debounce="500"
                                v-model="form.phone"
                                :lazy-rules="false"
                                :rules="[ phoneRule ]"
                                mask="+7(###)-###-##-##"
                                class="input contacts_input"
                                placeholder="Ваш телефон"
                                dense
                            />
                            <q-input
                                debounce="500"
                                v-model="form.email"
                                :lazy-rules="false"
                                :rules="[ emailRule ]"
                                class="input contacts_input"
                                placeholder="Ваш e-mail"
                                dense
                            />
                        </div>
                        <textarea v-model="form.text" class="textarea contacts_textarea" placeholder="Суть обращения"></textarea>
                        <div class="contacts_bottom">
                          <div class="slider contacts_slider">
                            <input @change="transformConfirm" ref="confirm" class="verify-slider" type="range" value="0" min="0" max="100" />
                            <span>Перетащите ползунок</span>
                          </div>
                          <q-btn :disable="submitBtnDisabled" label="Отправить" type="submit" class="button contacts_button"/>
                        </div>
                    </q-form>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'src/utils/axios'
import { useDialogPluginComponent } from 'quasar'
import { isValidEmail } from 'src/utils/mailValidation'
import { sendSentry } from 'src/utils/sendErrorSentry'

export default defineComponent({
  name: 'Contact',
  data () {
    return {
      contacts: {
        mapLink: '',
        name: '',
        directorName: '',
        address: '',
        phone: '',
        email: 'support@access2money.ru',
        inn: '9723119910',
        ogrn: '1217700325083',
        okvd: '66.19'
      },
      form: {
        name: '',
        email: '',
        phone: '',
        text: ''
      },
      showEmailError: false,
      showPhoneError: false,
      serverErrors: {},
      submitBtnDisabled: true
    }
  },
  methods: {
    submit () {
      api.post('v1/feedback/send', {
        name: this.form.name,
        phone: this.form.phone,
        email: this.form.email,
        text: this.form.text
      }).then(() => {
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
    emailRule (val) {
      if (this.showPhoneError) {
        return true
      } else {
        if (!val || val.length <= 0) {
          return 'Укажите ваш Email'
        } else {
          return isValidEmail(val)
        }
      }
    },
    phoneRule (val) {
      if (this.showEmailError) {
        return true
      } else {
        if (!val || val.length <= 0) {
          return 'Введите номер телефона'
        } else {
          return this.isValidPhone(val)
        }
      }
    },
    isValidPhone (val) {
      if (val.length === 17) {
        this.showPhoneError = true
        return true
      } else {
        return 'Неверный номер'
      }
    },
    showNotification (message) {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: message
      })
    },
    showSuccess () {
      this.$q.notify({
        color: 'positive',
        textColor: 'white',
        message: 'Успешно',
        type: 'positive',
        position: 'center'
      })
    },
    transformConfirm () {
      let val = Number(this.$refs.confirm.value)
      if (val > 0) {
        val = 100
        this.$refs.confirm.classList.add('active-thumb')
        this.submitBtnDisabled = false
      }
    }
  },
  setup () {
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
    return {
      dialogRef,
      onDialogHide,
      onOKClick () {
        onDialogOK()
      },
      onDialogOK
    }
  }
})
</script>

<style scoped lang="scss">
    .contact-wrapper {
        padding-bottom: 120px;
        @media (max-width: 767px) {
          padding-bottom: 60px;
        }
        .slider {
          span {
            z-index: 0;
          }
        }
        .active-thumb {
          width: 8% !important;
          overflow: initial !important;
          @media (max-width: 767px) {
            width: 14% !important;
          }
        }
        input[type="range"] {
          margin: auto;
          -webkit-appearance: none;
          position: absolute;
          overflow: hidden;
          height: 42px;
          width: 100%;
          transition: all 1s ease;
          right: 0;
          cursor: pointer;
          border-radius: 0; /* iOS */

          &::-webkit-slider-runnable-track {
            background: #fff;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 52px;
            background: #001966 url('../assets/images/6.svg') no-repeat 50% 50%;
            z-index: 9999999999;
            cursor: pointer;
            height: 42px;
            box-shadow: -100vw 0 0 100vw white;
            display: block;
            position: relative;
          }

          &::-moz-range-track {
              height: 40px;
              background: #fff;
          }
          &::-moz-range-thumb {
            width: 52px;
            background: #001966 url('../assets/images/6.svg') no-repeat 50% 50%;
            z-index: 3;
            cursor: pointer;
            height: 42px;
            border-radius: 0 !important;
            box-shadow: -100vw 0 0 100vw white;
            box-sizing: border-box;
            display: block;
            position: relative;
          }
          &::-ms-fill-lower {
            background: white;
            z-index: 3;
          }
          &::-ms-thumb {
            width: 52px;
            background: #001966 url('../assets/images/6.svg') no-repeat 50% 50%;
            z-index: 3;
            cursor: pointer;
            height: 42px;
            box-sizing: border-box;
            display: block;
            position: relative;
          }
          &::-ms-ticks-after {
            display: none;
          }
          &::-ms-ticks-before {
            display: none;
          }
          &::-ms-track {
            background: #fff;
            color: transparent;
            height: 40px;
            border: none;
          }
          &::-ms-tooltip {
            display: none;
          }
        }
    }
</style>
