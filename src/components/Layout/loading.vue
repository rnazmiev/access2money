<template lang="html">
  <div class="loading-page" v-if="loading" v-bind:class="{'inline' : inline}">
    <div class="spinner">
      <q-spinner-puff
        color="primary"
        size="2em"
      />
    </div>

  </div>
</template>

<script>
import { EventBus } from 'src/event-bus'

var timeout = false

export default {
  props: {
    inline: { default: false },
    loadings: { default: false }
  },
  data: function () {
    return {
      loading: this.loadings
    }
  },
  mounted: function () {

  },
  components: {},
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  },

  computed: {},
  watch: {
    loadings: function (val) {
      this.loading = val
      if (val) {
        timeout = setTimeout(() => {
          this.loading = false
          EventBus.emit('loading-stop')
        }, 25000)
      } else {
        clearTimeout(timeout)
        this.$nextTick(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
<style>
  .vue-simple-spinner {
    transition: all 0.3s linear;
  }

</style>
<style scoped lang="scss">
  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;

    font-size: 30px;
    font-family: sans-serif;
    z-index: 10000;

    &.inline{
      position: absolute !important;
      background-color: rgba(246, 244, 244, 0.34);
    }
    .spinner{
      margin-top: -30px;
      margin-left: -30px;
      position: absolute;
      height: 100%;
      left:50%;
      top:50%;

    }
  }
</style>
