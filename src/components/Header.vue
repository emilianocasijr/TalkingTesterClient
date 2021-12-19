<template>
  <div class="main-container">
    <div class="logo">Talking Tester</div>
    <div class="right-side">
      <div class="user-data">
        <div class="user">{{ username }}</div>
        <button class="logout" @click="logout">Logout</button>
      </div>
      <Dropdown title="About" :items="about" class="about" />
    </div>
    
  </div>
</template>

<script>
import Dropdown from './Dropdown';

export default {
  components:{
    Dropdown
  },
  data(){
    return{
      about:[
        {
          title: 'About application',
          link: '#'
        },
        {
          title: 'Found a bug?',
          link: '#'
        },
        {
          title: 'By Emiliano Casi Jr',
          link: '#'
        },
      ]
    }
  },
  computed: {
    username() {
      console.log(localStorage.username);
      return localStorage.username;
    },
  },
  methods:{
    logout(){
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.$router.push('login');
    }
  },
  created(){
      if(window.innerWidth < 340){
        this.about = [
          {
            title: 'About',
            link: '#'
          },
          {
            title: 'Bug?',
            link: '#'
          },
          {
            title: 'Emiliano',
            link: '#'
          },
        ]
      }
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  margin-bottom: 20px;
  background-color: #C4C4C4;
}

.logo{
  font-size: 28px;
  font-weight: 500;
  margin-left: 20px;
}

.user{
  font-size: 20px;
  font-weight: 400;
  margin-right: 20px;
}

button{
  cursor: pointer;
}

.logout{
  background: transparent;
  border: none;
  padding: 5px;
  border-radius: 5px;
}

.logout:hover{
  background: white;
}

.right-side{
  display: flex;
}

.about{
  text-align: center;
  margin: 0 20px;
  min-width: 200px;
  height: 30px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
@media (max-width:1025px){
  .about{
    min-width: 100px;
  }
}
@media (max-width:340px){
  .about{
    margin: 0;
  }
}

.about:hover{
  background-color: white;
}
</style>
