<template>
  <div class="main-container">
    <h2>Sign in to your account</h2>
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
      <button>Sign in</button>
    </form>
    <p>
      Don't have an account? <router-link to="register">SIGN UP</router-link>
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
        const res = await axios.post('api/auth', body, config);
        localStorage.setItem('token', res.data.token);
        const configGetUser = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token,
          },
        };
        const user = await axios.get('api/auth', configGetUser);
        this.$store.commit('updateUser', user.data);
        this.$router.push('dashboard');
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
}
</style>
