const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('src/pages/Home.vue') },
      {
        path: 'mybook',
        name: 'MyBook',
        component: () => import('pages/MyBook.vue'),
      },
    ],
  },
  {
    path: '/preview',
    component: () => import('layouts/MainLayout.vue'),
  },
  {
    path: '/readmybook',
    component: () => import('layouts/MainLayout.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
