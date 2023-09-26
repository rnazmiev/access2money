<template>
    <main class="content">
      <div class="container content_container">
        <div class="title content_title">Общие документы</div>
        <div class="faq">
          <div class="faq_left">
            <div class="faq_nav">
              <a href="#" class="active">Займы</a>
              <!-- <a href="#">Продажа обязательств</a> -->
            </div>
            <!-- <button type="button" class="button faq_button">Задать свой вопрос</button> -->
          </div>
          <div class="faq_right" ref="questions">
             <div
              v-for="(question, index) in questions"
              :key="question.id"
              ref="faqItem"
              @click="openList(index)"
              class="faq_item">
              <button
                type="button"
                class="js-toggle">
                {{ question.question_text }}
              </button>
              <div>
                <p>
                  {{ question.answer_text }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'src/utils/axios'
export default defineComponent({
  name: 'Faq',
  data () {
    return {
      questions: []
    }
  },
  mounted () {
    this.getFaqList()
  },
  methods: {
    getFaqList () {
      api.get('/v1/faq/list').then(({ data }) => {
        this.questions = data.data
      })
    },
    openList (index) {
      const button = this.$refs.questions.children[index].children[0]
      if (button.classList.contains('active')) {
        button.classList.remove('active')
      } else {
        button.classList.add('active')
      }
    }
  }
})
</script>

<style scoped>
  .faq {
    padding-bottom: 58px;
  }
</style>
