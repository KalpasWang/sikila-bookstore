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
      },
    ],
  },
  {
    path: '/preview/:id',
    name: 'Preview',
    component: () => import('pages/EBook.vue'),
  },
  {
    path: '/readmybook',
    name: 'Read',
    component: () => import('pages/EBook.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
