<template>
<q-uploader
    color="white"
    flat
    auto-upload
    class="a2m-uploader"
    :factory="makeUpload"
    :headers="[{name: 'Authorization', value: 'Bearer' + ' ' + token}]"
    field-name="file"
    style="width: 100%"
    ref="uploader"
    @uploaded="uploaded"
    @failed="failed">
  <template v-slot:header>
    <div class="thing-row">
      <label class="file-2">
        <input type="file" @change="addFile">
        <span>
          <img src="~assets/images/36.svg" alt="">
          Перетащите файл сюда
        </span>
      </label>
    </div>
  </template>
  <template v-slot:list>
    <div class="content_docs">
      <div v-for="file in files" v-bind:key="'file-'+file.id">
        <span class="content_doc">{{ file.name }}</span>
        <button type="button" class="hover" @click="remove(file)">
          <img src="~assets/images/29.svg" alt="">
        </button>
      </div>
    </div>
  </template>
</q-uploader>
</template>
<script>
import { defineComponent } from 'vue'
import { Cookies } from 'quasar'
import { EventBus } from 'src/event-bus'

const apiUrl = process.env.API_URL

export default defineComponent({
  name: 'PageBankOperations',
  mixins: [],
  components: {},
  props: ['preloadFiles', 'single'],
  data () {
    return {
      uploadUrl: apiUrl + '/v1/uploads',
      token: Cookies.get('api_token'),
      files: []
    }
  },
  mounted () {
    if (this.preloadFiles) {
      this.files = this.preloadFiles
    }
  },

  methods: {
    makeUpload () {
      EventBus.emit('loading-start')
      return new Promise((resolve) => {
        resolve({
          url: this.uploadUrl
        })
      })
    },
    remove (file) {
      this.$emit('file-removed', file)
      this.files = this.files.filter((filesFile) => filesFile.id !== file.id)
    },
    uploaded (response) {
      response = JSON.parse(response.xhr.response)

      if (this.single) {
        this.files = [response.data]
      } else {
        this.files.push(response.data)
      }

      this.$emit('file-uploaded', response.data)

      EventBus.emit('loading-stop')
    },
    failed () {
      EventBus.emit('loading-stop')
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Ошибка загрузки файла'
      })
    },
    addFile (event) {
      this.$refs.uploader.addFiles([event.target.files[0]])
      this.$emit('removed', event.target.files[0])
    }
  }
})
</script>
<style lang="scss">
  .a2m-uploader{
    flex-direction: row;
    display: flex;
    .q-uploader__header{
      width:45%;
    }
    &.vertical-list{
      flex-direction: column;
      max-height: 700px;
      .q-uploader__header{
        width:100%;
      }
      .content_docs{
        margin-bottom: 0px;
        padding-top: 0px;
        word-break: break-all;
      }
    }
    .content_docs{
      clear: both;
      width: 100%;
    }
  }
</style>
