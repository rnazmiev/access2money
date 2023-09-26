<template>
  <a href="/" class="header_logo">
    <img src="~assets/images/1.svg" alt="">
  </a>
  <nav class="header_nav" :class="{ 'active': isActive }">
    <router-link to="/" active-class="active">Получить займ</router-link>
    <!-- <router-link to="/faq" active-class="active">FAQ</router-link> -->
    <router-link to="/document" active-class="active">Документы</router-link>
    <router-link to="/contact" active-class="active">Контакты</router-link>
    <a :href="assessmentLink">Методология оценки</a>
    <a v-if="!user" href="#" @click.prevent="showAuthModal('sign-in')">Войти</a>
  </nav>
  <div class="header_icons">
    <router-link v-if="user" to="/my_loans" active-class="active">
       <img src="~assets/images/2.svg" alt="">
    </router-link>
    <a v-if="user" @click.prevent="logout" href="#">
      <img src="~assets/images/3.svg" alt="">
    </a>
    <button @click="isActive = !isActive" type="button" class="header_menu">
      <img src="~assets/images/12.svg" alt="">
    </button>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import AuthModal from 'components/Common/AuthModal/AuthModal'
import { mapGetters, mapActions } from 'vuex'

export default {
  setup () {
    const $q = useQuasar()

    return {
      showAuthModal (type) {
        $q.dialog({
          component: AuthModal,
          componentProps: {
            type: type
          }
        }).onOk(() => {
          console.trace('OK')
        }).onCancel(() => {
          console.trace('Cancel')
        }).onDismiss(() => {
          console.trace('Called on OK or Cancel')
        })
      }
    }
  },
  data () {
    return {
      assessmentLink: 'files/assessment_methodology.pdf',
      isActive: false
    }
  },
  computed: {
    ...mapGetters({ user: 'user/user' })
  },
  methods: {
    ...mapActions({ logout: 'user/logout' })
  }
}

</script>

<style scoped lang="scss">
.header_nav{
  a{
    color:#333;
  }
  .active {
    border-bottom: 0px !important;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background: #0DDE9F;
    }
  }
  @media (max-width:560px) {
    width: 100%;
  }
}
</style>
