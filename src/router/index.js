import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const loggedInGuard = (to, from, next) => {
  if (sessionStorage.getItem('loggedIn')) {
    next();
  } else {
    next('/');
  }
};

const notLoggedInGuard = (to, from, next) => {
  if (sessionStorage.getItem('loggedIn')) {
    next('/dashboard');
  } else {
    next();
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    beforeEnter: notLoggedInGuard,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    beforeEnter: loggedInGuard,
    children: [
      {
        path: '',
        component: () => import('../views/Dashboard/Home'),
      },
      {
        path: 'users',
        component: () => import('../views/Dashboard/Users'),
      },
      {
        path: 'cars',
        component: () => import('../views/Dashboard/Cars'),
      },
      {
        path: 'rentCar',
        component: () => import('../views/Dashboard/RentCar'),
      },
    ],
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
