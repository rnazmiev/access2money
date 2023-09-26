<template>
    <main class="content">
        <div class="container content_container">
            <div class="title content_title">Общие документы</div>
            <div class="text content_text">В этом разделе представлены обязательные для всех пользователей документы</div>
            <div class="content_docs">
                <a :href="document.termsUse"  download="public_offer.pdf" class="content_doc hover">Пользовательское соглашение</a>
                <a :href="document.dataPolicy"  download="term_use.pdf" class="content_doc hover">Политика обработки персональных данных</a>
            </div>
            <div class="title content_title">Сопроводительные документы по сделке</div>
            <div class="text content_text">В этом разделе представлены документы, подписание которых осуществляется для заключения сделки</div>
            <div class="content_docs">
                <a :href="document.loanContract" class="content_doc hover">Договор займа</a>
                <!-- <a :href="document.assignmentContract" class="content_doc hover">Договор инкасса-цессии</a>
                <a :href="document.refinancingContract" class="content_doc hover">Договор рефинансирования</a> -->
            </div>
        </div>
    </main>
</template>

<script>
import { defineComponent } from 'vue'
import config from 'src/config'

export default defineComponent({
  name: 'Document',
  data () {
    return {
      document: {
        termsUse: `${config.api_url}/documents/public/public_offer`,
        dataPolicy: `${config.api_url}/documents/public/privacy_policy`,
        loanContract: `${config.api_url}/documents/public/loan_offer`,
        assignmentContract: '#',
        refinancingContract: '#'
      }
    }
  }
})
</script>
