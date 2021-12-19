<template>
  <div class="wrapper">
    <LoginForm class='login-form'/>
  </div>
  
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  components: {
    LoginForm,
  },
};
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}

.login-form{
  margin: auto;
  
}
.wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
