import { createRouter, createWebHistory } from 'vue-router';

import Index from '../pages/Index/IndexPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: Index,
      name: 'index',
      path: '/',
    },
    {
      component: () => import('../pages/SignIn/SignInPage.vue'),
      name: 'signIn',
      path: '/sign-in',
    },
    {
      component: () => import('../pages/SignUp/SignUpPage.vue'),
      name: 'signUp',
      path: '/sign-up',
    },
  ],
});

export default router;
