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
      let user = this.$store.state.user;
      if (!user) { //redirect user if user is not logged in
        this.$router.push('login');
      } else {
        return user.username;
      }
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
