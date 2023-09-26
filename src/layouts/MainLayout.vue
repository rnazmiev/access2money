<template>
  <q-layout view="hhh lpR fff">
    <div class="wrapper">
      <q-header class="header bg-white">
        <div class="container header_container">
          <main-header></main-header>
        </div>
      </q-header>

      <q-page-container class="content">
        <router-view/>
      </q-page-container>

      <q-footer class="footer">
        <div class="container footer_container">
          <main-footer></main-footer>
        </div>
      </q-footer>
    </div>
  </q-layout>
  <loading :loadings="loading"></loading>
  <error502 :showError502="show502" :title="showTitle"></error502>
</template>

<script>

import { defineComponent } from 'vue'
import mainHeader from 'src/layouts/parts/MainHeader'
import mainFooter from 'src/layouts/parts/MainFooter'
import loading from 'components/Layout/loading'
import loadingMixin from 'src/mixins/loading'
import show502Mixin from 'src/mixins/error502'
import loadScript from 'src/utils/loadScript'
import error502 from 'components/Layout/Error502'

export default defineComponent({
  name: 'MainLayout',
  mixins: [loadingMixin, show502Mixin],
  components: {
    mainHeader,
    mainFooter,
    loading,
    error502
  },
  created () {
    loadScript('//code-ya.jivosite.com/widget/twWsqs2ZXR')
  }
})
</script>

<style lang="scss">
  .wrapper {
    position: initial;
  }
</style>
