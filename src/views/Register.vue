<template>
  <div class="wrapper">
    <RegisterForm class='register-form'/>
  </div>
</template>

<script>
import RegisterForm from '@/components/RegisterForm.vue';

export default {
  components: {
    RegisterForm,
  },
};
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}

.register-form{
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
