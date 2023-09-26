<template>
  <q-page class="flex flex-center">
    <div class="container content_container">
      <div class="content_side2">
        <div class="content_toper">
          <div>Ваш предварительный рейтинг: <span>{{ client.rating }}</span></div>
          <div>Доступный лимит: <span>{{ numerial(currentCreditProduct.max_amount) }} ₽</span></div>
          <div>Ставка: <span>{{ currentCreditProduct.yearly_percent }}% годовых</span></div>
        </div>
        <!--
        <div class="title content_title">Загрузите банковскую выписку</div>
        <div class="text content_text">Для корректного рассчета лимита рекомендуем сформировать и загрузить выписку за 1
          год от текущей даты. Минимально доступная выписка для расчета лимита - не менее 6 месяцев. Если вы используете
          несколько счетов в одном или разных банках, загрузите выписки со всех счетов для полноты данных и расчета
          более высокого лимита. Выписку следует формировать в формате .txt, в вашем банке она может называться также
          "Выписка в формате 1С".
        </div>
        <br><br>
        <div class="text content_text"><span class="blue">Если вам нужна инструкция, по скачиванию выписки в кабинете банка, выберите его из списка</span>
        </div>
        <select class="select content_select" v-model="activeBankId">
          <template v-for="bank in banks" v-bind:key="'bank-'+bank.id" >
            <option :value="bank.bank_id" :selected="activeBankId == bank.bank_id" >{{ bank.bank_name }}</option>
          </template>
        </select>
        <div class="instruction" v-if="activeBankInstruction">
          <div v-if="activeBankInstruction.link">Чтобы открыть инструкцию пройдите по ссылке: <a  class="link"  :href="activeBankInstruction.link" target="_blank">{{ activeBankInstruction.link }}</a></div>
          <div class="text" v-if="activeBankInstruction.text"> <pre>{{ activeBankInstruction.text }}</pre></div>
        </div>
        <files-upload class="files-upload" @file-uploaded="fileUploaded" @file-removed="fileRemoved" :preload-files="preloadUploadedBankOperations"></files-upload>
        -->
        <q-form id="company_directorDataForm" class="q-mb-xl" style="margin-top: 40px; margin-bottom: 80px">
          <div class="title content_title">Введите данные директора</div>
          <div class="q-gutter-md row">
            <q-input
              type="text"
              class="input"
              v-model="form.company_director_passport_serial"
              dense
              unmasked-value
              placeholder="Серия паспорта"
              maxlength="4"
              :lazy-rules="true"
              :model-value="form.company_director_passport_serial"
              :rules="[val => (!!val && val.length === 4) || 'Поле Серия паспорта должно содержать 4 символа']"
            />
            <q-input
              type="text"
              class="input"
              v-model="form.company_director_passport_number"
              dense
              placeholder="Номер паспорта"
              maxlength="6"
              :model-value="form.company_director_passport_number"
              :rules="[val => (!!val && val.length === 6) || 'Поле номер паспорта должно содержать 6 символов']"
            />
            <q-input
              v-model="form.company_director_passport_date_of_issue"
              dense
              mask="xx.xx.xxxx"
              class="input"
              :rules="[val => !!val || 'Поле обязательно для заполнения!']"
              :model-value="form.company_director_passport_date_of_issue"
              placeholder="Дата выдачи"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.company_director_passport_date_of_issue" :model-value="form.company_director_passport_date_of_issue" minimal mask="DD.MM.YYYY" :navigation-max-year-month="maxYearMonthRestrictionDate" :locale="date_locale">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              v-model="form.company_director_passport_date_of_birth"
              dense
              mask="xx.xx.xxxx"
              class="input"
              :rules="[val => !!val || 'Поле обязательно для заполнения!']"
              :model-value="form.company_director_passport_date_of_birth"
              placeholder="Дата рождения"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.company_director_passport_date_of_birth" :model-value="form.company_director_passport_date_of_birth" minimal mask="DD.MM.YYYY" :navigation-max-year-month="maxYearMonthRestrictionDate" :locale="date_locale">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-form>
        <div class="title load_title">Загрузите отчётность</div>
        <div class="load_row">
          <div class="load_left" style="width: 900px;">
            <div class="subtitle content_subtitle">Как это работает</div>
            <div class="text content_text">Скачайте с сайта специальный файл, который нужно будет запустить в обработчике вашей 1С.
              Программа содержащаяся в файле сама соберет все необходимые данные
              и перед отправкой на сервер отобразит их в окне предпросмотра. Мы гарантируем полную конфиденциальность данных.</div>
            <div class="text content_text download-options">
              <a href="files/Smartan_2021_12_21.epf" class="content_doc">Скачать файл автовыгрузки</a>
              <a href="files/instructions_uploading_data.docx" class="content_doc">Скачать инструкцию для запуска в приложениях 1С</a>
              <a href="files/instructions_uploading_data_fresh.docx" class="content_doc">Скачать инструкцию для запуска в приложениях на базе 1С:Fresh</a>
            </div>
          </div>
            <!--          <button type="button" class="button load_button js-1" @click="submit">Далее</button>-->

        </div>
        <button type="button" class="button" style="margin-bottom: 40px; margin-top: 80px;" @click="submit" form="company_directorDataForm"><span>Продолжить</span></button>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import scoringMixin from 'src/mixins/scoring'
import { arrange } from 'src/utils/helpers'
import numeral from 'numeral'
import { api } from 'src/utils/axios'
// import FilesUpload from 'components/Frames/FileUpload'
import notify from 'src/utils/notify'
import config from 'src/config'
import { EventBus } from 'src/event-bus'
import { sendSentry } from 'src/utils/sendErrorSentry'

const dateTranslate = {
  /* starting with Sunday */
  days: 'Понедельник_Вторник_Среда_Четверг_Пятница_Суббота_Воскресенье'.split('_'),
  daysShort: 'Пон_Втр_Срд_Чтв_Пят_Суб_Вск'.split('_'),
  months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split('_'),
  monthsShort: 'Янв_Фев_Мар_Апр_Май_Июн_Июл_Авг_Сен_Окт_Ноя_Дек'.split('_'),
  firstDayOfWeek: 1
}

export default defineComponent({
  name: 'PageBankOperations',
  mixins: [scoringMixin],
  components: { },
  data () {
    return {
      banks: [],
      activeBankId: null,
      fileHasUploaded: false,
      preloadFilesLoaded: false,
      uploadedBankOperations: [],
      preloadUploadedBankOperations: [],
      clientReportType: 'autoload',
      reportFile: null,
      api_url: config.api_url,
      date_locale: dateTranslate,
      form: {
        company_director_passport_number: '',
        company_director_passport_serial: '',
        company_director_passport_date_of_issue: '',
        company_director_passport_date_of_birth: ''
      },
      maxYearMonthRestrictionDate: ''
    }
  },
  async created () {
    console.log(this.client)
    if (this.client) {
      this.form.company_director_passport_number = this.client.company_director_passport_number
      this.form.company_director_passport_serial = this.client.company_director_passport_serial
      this.form.company_director_passport_date_of_birth = this.client.company_director_passport_date_of_birth
    }
    const id = this.client && this.client.id
    return await api.get(`/v1/bank/client/${id}/operations`).then(({ data }) => {
      this.preloadFilesLoaded = true
      if (data.data.length > 0) {
        this.fileHasUploaded = true
      }
      data.data.forEach((opeation) => {
        this.uploadedBankOperations.push({ file: opeation.file, id: opeation.id })
        this.preloadUploadedBankOperations.push(opeation.file)
      })
      return data
    }).catch((e) => {
      this.preloadFilesLoaded = true
      sendSentry(e)
    })
  },
  mounted () {
    /*
   api.get('/v1/bank/instructions').then(({ data }) => {
      this.banks = data.data
      const activeBank = data.data.filter((bank) => { return bank.default })
      if (activeBank.length > 0) {
        this.activeBankId = activeBank[0].bank_id
      }
    })
    */
    const currentDate = new Date()
    this.maxYearMonthRestrictionDate = `${currentDate.getFullYear()}/${currentDate.getMonth()}`
  },
  computed: {
    ...mapGetters({
      client: 'client/client',
      currentCreditProduct: 'creditProduct/currentCreditProduct'
    }),
    activeBankInstruction () {
      const activeBank = this.banks.filter((bank) => { return bank.bank_id === this.activeBankId })
      return activeBank ? activeBank[0] : null
    }
  },

  methods: {
    arrange (digits, words) {
      return arrange(digits, words)
    },
    numerial (digits) {
      return numeral(digits).format('0,0').replaceAll(/,/g, ' ')
    },
    fileUploaded (file) {
      if (!file) {
        return
      }
      this.fileHasUploaded = true
      api.post('/v1/bank/client-operations', { bank_id: this.activeBankId, file_id: file.id }).then(({ data }) => {
        this.uploadedBankOperations.push({ file: file, id: data.id })
        return notify.success('Банковская выписка загружена, вы можете загрузить еще одну при необходимости!')
      })
    },
    fileRemoved (file) {
      if (!file) {
        return
      }
      const operationId = this.uploadedBankOperations.filter((operation) => { return operation.file.id === file.id })[0].id
      api.delete('/v1/bank/client-operations/' + operationId).then(({ data }) => {
        return notify.success('Банковская выписка загружена, вы можете загрузить еще одну при необходимости!')
      })
    },
    reportFileUploaded (file) {
      if (!file) {
        return false
      }
      this.reportFile = file
      return true
    },
    reportFileRemoved () {
      this.reportFile = null
    },
    submit () {
      /* if (!this.fileHasUploaded) {
        return notify.error('Вы не загрузили банковскую выписку!')
      } */

      if (!this.form.company_director_passport_number || !this.form.company_director_passport_serial || !this.form.company_director_passport_date_of_issue || !this.form.company_director_passport_date_of_birth) {
        return notify.error('Вы не заполнили данные  паспорта!')
      }

      if (!this.reportFile && this.clientReportType !== 'autoload') {
        notify.error('Вы не загрузили файл отчетности!')
      }

      const id = this.client && this.client.id
      EventBus.emit('loading-start')
      api.post(`/v1/client/${id}/set-director-data`, this.form)
        .then(res => {
          const data = {
            file_id: this.reportFile ? this.reportFile.id : null,
            report_type: this.clientReportType,
            client_report_autoload: this.clientReportType === 'autoload' ? 1 : 0
          }
          api.post('/v1/clients/reports/upload', data).then(({ data }) => {
            this.$q.notify('Данные успешно загружены')
            EventBus.emit('loading-stop')
            this.$router.push('/scoring')
          }).catch(({ response }) => {
            EventBus.emit('loading-stop')
            notify.error('Неизвестная ошибка, обратитесь в службу поддержки')
            sendSentry(response)
          })
        }).catch(error => {
          EventBus.emit('loading-stop')
          notify.error('Неизвестная ошибка, обратитесь в службу поддержки')
          console.debug({ error })
          sendSentry(error)
        })
      // this.$router.push('/client_report')
    },
    downloadFile () {
      api.get('v1/client/reports/autoload-file').then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', response.headers.filename)
        document.body.appendChild(fileLink)
        fileLink.click()
      }).catch(({ response }) => {
        sendSentry(response)
        return this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Неизвестная ошибка, обратитесь в службу поддержки'
        })
      })
    }
  }
})
</script>
<style lang="scss" scoped>
  .big_button.disabled {
    color: #ccc;
  }
  .files-upload {
    margin-top: 40px;
    width:100%
  }
  .q-field--error {
    margin-bottom: 15px;
  }
  .download-options {
    a {
      display: block;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
