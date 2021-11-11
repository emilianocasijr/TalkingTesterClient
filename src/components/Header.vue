<template>
  <div class="main-container">
    <div class="logo">Talking Tester</div>
    <div class="user">{{ username }}</div>
  </div>
</template>

<script>
export default {
  computed: {
    username() {
      console.log(localStorage.username);
      return localStorage.username;
    },
  },
};
</script>

<style scoped>
.main-container {
  height: 60px;
  display: flex;
  justify-content: space-between;
}
</style>
