<template>
  <div class="ras">
    <div class="title ras_title">Для получения займа необходимо заполнить анкету заемщика</div>
    <div class="progress ras_progress">
      <div class="progress_one" :style="{width: `${progress}%`}"></div>
      <div class="progress_two">Вероятность одобрения {{ progress }}%</div>
    </div>
    <div class="ras_tabs">
      <router-link to="/credit_product"><button  type="button" class="done">Условия</button></router-link>
      <img src="~assets/images/24.svg" alt="">
      <button type="button" class="active">Данные заемщика</button>
      <img src="~assets/images/24.svg" alt="">
      <button type="button">Соглашения</button>
    </div>
    <div class="title ras_title">Идентификация</div>
    <q-form @submit="submitStep">
      <div v-if="step === 2" class="ras_iden">
        <div class="ras_iden-item">
          <q-input
            v-model="form.company_account_number"
            class="input"
            placeholder="Расчетный счет"
            dense
            :model-value="form.company_account_number"
            :rules="[val => !!val || 'Поле обязательно для заполнения!']"
          />
        </div>
        <div class="ras_iden-item">
          <q-input
            filled
            v-model="form.company_account_bik"
            use-input
            dense
            class="input"
            input-debounce="100"
            placeholder="БИК"

            option-label="bic"
            option-value="bic"
            emit-value
            map-options

            maxlength="9"
            :model-value="form.company_account_bik"
            :rules="[val => (!!val && val.length === 9) || 'Поле БИК должно содержать 9 символов']"
          >
          </q-input>
        </div>
        <div class="ras_iden-item">
          <q-input
            type="text"
            class="input"
            v-model="form.company_account_address"
            placeholder="Адрес юридический"
            dense
            :model-value="form.company_account_address"
            :rules="[val => !!val || 'Поле обязательно для заполнения!']"
          />
        </div>
        <div class="ras_iden-item">
          <q-input
            type="text"
            class="input"
            v-model="form.company_activity_address"
            placeholder="Адрес фактический"
            dense
            :model-value="isAddressMatched ? form.company_account_address : form.company_activity_address"
            :rules="[val => (!!val && !isAddressMatched) || 'Поле обязательно для заполнения!']"
            :disable="isAddressMatched"
          />
          <label class="checkbox ras_checkbox" :class="{'checkbox-checked': isAddressMatched}">
            <input type="checkbox" v-model="isAddressMatched">
            <span class="checkbox_one"></span>
            <span class="checkbox_two">Совпадает с юр. адресом</span>
          </label>
        </div>
        <div class="ras_iden-item">
          <q-input
            type="text"
            class="input"
            v-model="form.company_manager_name"
            placeholder="ФИО уполномоченного лица"
            dense
            :model-value="form.company_manager_name"
            :rules="[val => !!val || 'Поле обязательно для заполнения!']"
          />
        </div>
        <div class="ras_iden-item" style="display: table; height: 100%;">
          <q-input
            type="text"
            class="input"
            v-model="form.company_manager_position"
            placeholder="Должность уполномоченного лица"
            dense
            :model-value="form.company_manager_position"
            :rules="[val => !!val || 'Поле обязательно для заполнения!']"
          />
          <div style="display: table; width: 100%;  height: 100%; ">
            <div v-if="showProcurationFields" style="margin-top: 30px">
            <div class="item">
              <q-input
                  type="text"
                  class="input"
                  v-model="form.procuration_number"
                  placeholder="Номер доверенности"
                  dense
                  :model-value="form.procuration_number"
                  :rules="[val => !!val || 'Поле обязательно для заполнения!']"
              />
            </div>
            <div class="item" style="margin-bottom: -30px">
              <q-input
                  v-model="form.procuration_date"
                  dense
                  mask="xx.xx.xxxx"
                  :rules="[val => !!val || 'Поле обязательно для заполнения!']"
                  :model-value="form.procuration_date"
                  placeholder="Дата доверенности"
              >
              </q-input>
            </div>
            </div>
            <div style="display:table; height: 100%; width: 100%">
              <div class="ras_bottom">Основание полномочий</div>
              <select class="select" v-model="form.company_business_right_id" required>
                <option v-for="item in listCompanyBusinessRight" :key="`rights-${item.id}`" :selected="item.code === this.form.company_business_right_id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <q-btn type="submit" class="button ras_button" flat>Далее</q-btn>
    </q-form>
  </div>
</template>

<script>
import { api } from 'src/utils/axios'
import { mapGetters } from 'vuex'
import notify from 'src/utils/notify'
import { EventBus } from 'src/event-bus'
import { sendSentry } from 'src/utils/sendErrorSentry'
export default {
  name: 'LoanAskForm',
  created () {
    const id = this.user.client.data.id
    api.get(`/v1/client/${id}/company-info`)
      .then(({ data }) => {
        let defaultBusinessRightId = '2'
        // let defaultBusinessRightId = '2'
        this.form.company_manager_name = data.data.company_manager_name
        this.form.company_manager_position = data.data.company_manager_position
        this.form.company_account_bik = data.data.company_account_bik
        this.form.company_account_address = data.data.company_account_address
        this.form.company_account_number = data.data.company_account_number
        this.form.company_activity_address = data.data.company_activity_address
        this.form.procuration_date = data.data.procuration_date
        this.form.procuration_number = data.data.procuration_number
        if (this.listCompanyBusinessRight) {
          defaultBusinessRightId = this.listCompanyBusinessRight.find(item => item.name === 'Устав').code
        }
        this.form.company_business_right_id = data.data.company_business_right_id || defaultBusinessRightId
      })
      .catch(({ response }) => {
        console.debug({ response })
        notify.error(response.data.message)
        sendSentry(response)
      })
  },
  data () {
    return {
      progress: 40,
      form: {
        company_manager_name: '',
        company_manager_position: '',
        company_account_bik: '',
        company_account_address: '',
        company_account_number: '',
        company_activity_address: '',
        company_business_right_id: null,
        procuration_date: null,
        procuration_number: null
      },
      loanAskId: null,
      isAddressMatched: false,
      errors: {},
      step: 2,
      bikVariants: null,
      showProcurationFields: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      listCompanyBusinessRight: 'settings/listCompanyBusinessRight'
    })
  },
  watch: {
    isAddressMatched (value) {
      if (value) {
        this.form.company_activity_address = this.form.company_account_address
      }
    },
    'form.company_business_right_id' (value) {
      console.log(value, 'value', this.listCompanyBusinessRight, this.listCompanyBusinessRight.filter((item) => parseInt(item.code) === parseInt(value)))
      if (this.listCompanyBusinessRight.filter((item) => parseInt(item.code) === parseInt(value))[0].is_procuration === true) {
        this.showProcurationFields = true
      } else {
        this.showProcurationFields = false
      }
    }
  },
  methods: {
    submitStep () {
      EventBus.emit('loading-start')
      const id = this.user.loan_ask.data.id
      const data = { ...this.form, company_activity_address: this.isAddressMatched ? this.form.company_account_address : this.form.company_activity_address }
      api.post(`/v1/loan/ask/${id}`, data).then(({ data }) => {
        console.debug({ data })
        EventBus.emit('loading-stop')
        this.$router.push('/commit_loan_ask')
      }).catch(({ response }) => {
        EventBus.emit('loading-stop')
        console.debug({ response })
        notify.error(response.data.message)
        sendSentry(response)
      })
    },
    filterFn (val, update) {
      if (val.length === 9) {
        api.get(`/v1/dadata/bank-info?bik=${val}`).then(res => {
          update(
            () => {
              this.bikVariants = [res.data.data]
            }
          )
        })
      } else {
        this.bikVariants = []
      }
    }
  }
}
</script>

<style scoped>
  .ras_checkbox {
    margin-top: 30px;
  }
  .checkbox-checked {
    margin-top: 15px;
  }
  .item{
    height: 70px;
    display: table;
    width: 100%;
  }
</style>
