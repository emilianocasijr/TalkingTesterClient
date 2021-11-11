<template>
  <div class="main-container">
    <Header />
    <QuestionSets @createQuestionSet="createQuestionSet" />
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

<style scoped></style>
