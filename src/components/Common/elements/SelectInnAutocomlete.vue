<template>
  <q-select
      use-input
      clearable
      square
      borderless
      hide-selected
      hide-dropdown-icon
      input-debounce="100"
      v-model="innValue"
      @input-value="setValue"
      fill-input
      @filter="searchInn"
      :placeholder="'Введите ИНН компании'"
      :options="innCases"
      maxlength="10"
      :option-label="(item) =>  item.name"
      class="autocompleteInnClass"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Компания с указанным ИНН не найдена
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" @click="selectCompany(scope.opt)">
        <q-item-section @click="setCompany(scope.opt)">
          <div class="big_search active">
            <div>Ваша компания:  {{ scope.opt.name }}</div>
            <div><span> {{ scope.opt.address_string }}</span></div>
            <div>Директор: <span>{{ scope.opt.director_name }}</span></div>
          </div>
        </q-item-section>
      </q-item>
    </template>
  </q-select>

</template>

<script>
import { api } from 'src/utils/axios'
import { sendSentry } from 'src/utils/sendErrorSentry'

export default {
  name: 'selectInnAutocomlete',
  watch: {
    selectedValue: function () {
      this.$emit('input', this.selectedValue)
    }
  },
  computed: {},
  data () {
    return {
      innValue: '',
      innCases: []
    }
  },
  methods: {
    setCompany (value) {
    },
    setValue (value) {
      this.innValue = value
    },
    searchInn (value, update, abort) {
      if (value.length !== 10) {
        abort()
        return false
      }
      api.get('/v1/dadata/company-info/' + value).then((res) => {
        if (res.status === 200) {
          update(
            () => {
              this.innCases = [res.data.data]
            }
          )
        }
      }).catch((e) => {
        sendSentry(e)
        update(
          () => {
            this.innCases = []
          }
        )
      })
    },
    selectCompany (item) {
      this.innValue = item
      this.$emit('commit', item)
    }
  }
}
</script>
<style lang="scss">
  .autocompleteInnClass{
    input{
      color: #797979;
      border: none;
      border-bottom: 2px solid #797979;
      height: 40px;
      font-size: 24px;
    }
  }
</style>
