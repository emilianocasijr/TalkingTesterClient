import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import CreateQuestionSet from '../views/CreateQuestionSet.vue';
import QuestionSet from '../views/QuestionSet.vue';
import axios from 'axios';

Vue.use(VueRouter);

async function authenticateUser() {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };
    let res = await axios
      .get('api/auth', config)
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.log('error detected');
        console.log(error);
        return false;
      });
    return res;
  } catch (error) {
    console.log('server error');
    console.log(error);
    return false;
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      loggedOut: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      loggedOut: true,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/create-question-set',
    name: 'CreateQuestionSet',
    component: CreateQuestionSet,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/question-set',
    name: 'QuestionSet',
    component: QuestionSet,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log('checking auth');
    try {
      let res = await authenticateUser();
      if (res == false) {
        console.log('unauthorized user');
        throw 'unauthorized user';
      }
      console.log('authenticated user');
      next();
    } catch (error) {
      console.log(error);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      next({ path: '/login' });
    }
  } else if (to.matched.some((record) => record.meta.loggedOut)) {
    console.log('second route check');
    try {
      let res = await authenticateUser();
      if (res == false) {
        console.log('unauthorized user');
        throw 'unauthorized user';
      }
      console.log('authenticated user');
      next({ path: '/dashboard' });
    } catch (error) {
      console.log(error);
      next();
    }
  } else {
    next();
  }
});
export default router;
