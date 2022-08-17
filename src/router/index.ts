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
      component: () => import('../pages/ChangePassword/ChangePasswordPage.vue'),
      name: 'changePassword',
      path: '/change-password',
    },
    {
      component: () => import('../pages/DeleteAccount/DeleteAccountPage.vue'),
      name: 'deleteAccount',
      path: '/delete-account',
    },
    {
      component: () => import('../pages/Home/HomePage.vue'),
      name: 'home',
      path: '/home',
    },
    {
      component: () => import('../pages/MobileSignIn/MobileSignInPage.vue'),
      name: 'mobileSignIn',
      path: '/mobile-sign-in',
    },
    {
      component: () => import('../pages/Recovery/RecoveryPage.vue'),
      name: 'recovery',
      path: '/recovery',
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
    {
      component: () => import('../pages/UpdateRecovery/UpdateRecoveryPage.vue'),
      name: 'updateRecovery',
      path: '/update-recovery',
    },
    {
      component: () => import('../pages/NotFound/NotFoundPage.vue'),
      name: 'notFound',
      path: '/:pathMatch(.*)*',
    },
  ],
});

export default router;
