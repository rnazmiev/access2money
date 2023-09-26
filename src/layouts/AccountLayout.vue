<template>
  <q-layout view="hhh lpR fff">
  <div class="wrapper">
    <q-header class="header bg-white">
      <div class="container header_container">
        <main-header></main-header>
      </div>
    </q-header>
    <q-page-container>
      <div class="content">
        <div class="container content_container">
          <account-header />
          <div class="account-content">
            <router-view/>
          </div>
        </div>
      </div>
    </q-page-container>

    <q-footer class="footer">
      <div class="container footer_container">
        <main-footer></main-footer>
      </div>
    </q-footer>
  </div>
  </q-layout>
  <loading :loadings="loading"></loading>
</template>

<script>
import { defineComponent } from 'vue'
import mainHeader from 'src/layouts/parts/MainHeader'
import mainFooter from 'src/layouts/parts/MainFooter'
import accountHeader from 'src/layouts/parts/AccountHeader'
import loading from 'components/Layout/loading'
import loadingMixin from 'src/mixins/loading'
import loadScript from 'src/utils/loadScript'

export default defineComponent({
  name: 'AccountLayout',
  mixins: [loadingMixin],
  components: {
    mainHeader,
    mainFooter,
    accountHeader,
    loading
  },
  created () {
    loadScript('//code-ya.jivosite.com/widget/twWsqs2ZXR')
  }
})
</script>

<style lang="scss">
  .account-content {
    padding-bottom: 120px;
    @media(max-width:767px) {
      padding-bottom: 60px;
    }
  }
</style>
