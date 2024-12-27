const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'), // Main Layout
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }, // Home page
      { path: 'login', component: () => import('pages/LoginPage.vue') }, // Login page
      { path: 'files', component: () => import('pages/FileSharingPage.vue') }, // File sharing page
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'), // 404 error page
  },
];

export default routes;
