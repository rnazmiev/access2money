<template>
  <div class="title content_title">Личный кабинет</div>
  <div class="content_tabs-wrapper">
    <div class="content_tabs">
      <router-link to="/my_loans" active-class="active">Мои займы</router-link>
      <router-link to="/account_document" active-class="active">Мои документы</router-link>
      <router-link to="/account_transaction" active-class="active">История транзакций</router-link>
      <router-link to="/account_setting" active-class="active">Настройки</router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AccountHeader'
})
</script>
