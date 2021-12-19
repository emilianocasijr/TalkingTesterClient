<template>
  <div class="main-container">
    <Header />
    <QuestionSets @createQuestionSet="createQuestionSet" class='question-sets'/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import QuestionSets from '@/components/QuestionSets.vue';

export default {
  components: {
    QuestionSets,
    Header,
  },

  methods: {
    createQuestionSet() {
      this.$router.push({ path: `create-question-set` });
    },
  },
};
</script>

<style scoped>
.question-sets{
  margin: auto;
}

@media (max-width:1025px){
  .question-sets{
    margin: 0 5% auto;
    margin-bottom: 20px;
  }
}
</style>
