import { getCurrentUser, projectFirestore } from 'boot/firebase.config';
import Vue from 'vue';

// auth guards
// eslint-disable-next-line space-before-function-paren
const requireAuth = async (to, from, next) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } catch (error) {
    Vue.prototype.$q.dialog({
      title: '發生錯誤',
      message: error.message,
    });
  }
};

// admin auth guards
// eslint-disable-next-line space-before-function-paren
const requireAdminAuth = async (to, from, next) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error();
    } else {
      const res = await projectFirestore
        .collection('admin')
        .where('email', '==', user.email)
        .get();
      if (res.empty) {
        throw new Error();
      }
      next();
    }
  } catch (error) {
    next({ name: 'AdminLogin' });
  }
};

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('src/pages/Home.vue') },
      {
        path: 'products/:id',
        name: 'ProductDetails',
        component: () => import('pages/ProductDetails.vue'),
      },
      {
        path: 'mybook',
        name: 'MyBook',
        component: () => import('pages/MyBook.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('pages/Login.vue'),
      },
      {
        path: 'signup',
        name: 'Signup',
        component: () => import('pages/Signup.vue'),
      },
    ],
  },
  {
    path: '/preview/:id',
    name: 'Preview',
    component: () => import('pages/EBook.vue'),
  },
  {
    path: '/readmybook/:id',
    name: 'Read',
    component: () => import('pages/EBook.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/adminlogin',
    name: 'AdminLogin',
    component: () => import('pages/AdminLogin.vue'),
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    beforeEnter: requireAdminAuth,
    children: [
      {
        path: '',
        name: 'Admin',
        component: () => import('pages/Dashboard.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
