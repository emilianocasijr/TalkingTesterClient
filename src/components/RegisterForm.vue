<template>
  <div class="main-container">
    <h2>Register you account</h2>
    <form v-on:submit.prevent="onSubmit">
      <label for="username">Enter your username</label><br />
      <input
        type="text"
        id="username"
        name="username"
        v-model="username"
      /><br />
      <label for="password">Enter you password</label><br />
      <input type="password" id="password" name="password" v-model="password" />
      <button>Sign up</button>
    </form>
    <p>
      Already have an account? <router-link to="login">SIGN IN</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    async onSubmit() {
      console.log('form submit');
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({
        username: this.username,
        password: this.password,
      });

      try {
        const res = await axios.post('api/users', body, config);
        localStorage.setItem('token', res.data.token);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-container {
  margin: auto;
  padding: 0 50px;
  width: 500px;
  height: 600px;
  background: white;
  border-radius: 9px;
}

h2 {
  text-align: center;
  padding-top: 65px;
  padding-bottom: 65px;
  font-size: 30;
}

input {
  width: 100%;
  height: 30px;
  margin-bottom: 20px;
}

button{
  font-size: 16px;
  padding: 5px 10px;
  margin-bottom: 20px;
}
</style>
