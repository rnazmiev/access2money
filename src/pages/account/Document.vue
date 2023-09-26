<template>
  <div class="content_table-wrapper">
        <div class="content_table content_table__d">
          <div class="content_table-head">
            <div class="content_table-head-1">
              Название
              <button type="button">
                <img src="~assets/images/44.svg" alt="">
              </button>
            </div>
            <div class="content_table-head-2">
              Дата формирования
              <button type="button">
                <img src="~assets/images/44.svg" alt="">
              </button>
            </div>
            <div class="content_table-head-3">
              Статус подписания
            </div>
            <div class="content_table-head-4">
              Ссылка
            </div>
          </div>
          <div
            v-for="(document, index) in documents"
            :key="index"
            class="content_table-item">
            <div class="content_table-item-1">
              {{ getName(document.name) }}
            </div>
            <div class="content_table-item-2">
              {{ showDate(document.date) }}
            </div>
            <div class="content_table-item-3">
              {{ document.status === 'unsigned' ? 'Не подписан': 'Подписан' }}
            </div>
            <div class="content_table-item-4">
              <a href="javascript:void(0)" @click="getDocument(document.url)" class="pdf">
                <img src="~assets/images/5.svg" alt="">
              </a>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'src/utils/axios'
import config from 'src/config'
import { Cookies } from 'quasar'
import { showDate } from 'src/utils/formatDate'

export default defineComponent({
  name: 'account-document',
  data () {
    return {
      documents: [],
      showDate
    }
  },
  mounted () {
    this.getDocuments()
  },
  methods: {
    getDocuments () {
      api.get('v1/client/documents').then(({ data }) => {
        this.documents = data.data.map(item => {
          return {
            name: item.appointment,
            date: item.created_at,
            status: item.status,
            url: `${config.api_url}${item.download_url}`
          }
        })
      })
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
    },
    getName (name) {
      let documentName = ''
      switch (name) {
        case 'loan_offer' :
          documentName = 'Договор займа'
          break
        case 'privacy_policy' :
          documentName = 'Политика конфиденциальности'
          break
        case 'public_offer' :
          documentName = 'Пользовательское соглашение'
          break
      }
      return documentName
    }
  }
})
</script>
