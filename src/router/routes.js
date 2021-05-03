import { projectAuth } from 'boot/firebase.config';

// auth guards
const requireAuth = (to, from, next) => {
  const user = projectAuth.currentUser;
  // console.log('current user in auth guard: ', user);
  if (!user) {
    next({ name: 'Home' });
  } else {
    next();
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
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
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
