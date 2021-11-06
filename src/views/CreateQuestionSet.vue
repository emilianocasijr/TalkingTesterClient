<template>
  <div>
    <Header />
    <CreateQuestionSet />
  </div>
</template>

<script>
import CreateQuestionSet from '@/components/CreateQuestionSet.vue';
import Header from '@/components/Header.vue';

export default {
  components: {
    CreateQuestionSet,
    Header,
  },
};
</script>

<style></style>
