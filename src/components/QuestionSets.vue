<template>
  <div class="main-container">
    <h1>Question Sets</h1>
    <button @click="createQuestionSet">Create New</button>
    <div class="card-container">
      <table>
        <tr>
          <th>Set Title</th>
          <th>Current Rate</th>
          <th>Date Modified</th>
          <th>Tools</th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    createQuestionSet() {
      this.$emit('createQuestionSet');
    },
  },
};
</script>

<style scoped>
.main-container {
  max-width: 1400px;
  min-height: 700px;
}

table {
  background-color: #c4c4c4;
}
</style>
