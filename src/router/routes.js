const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('layouts/MainLayout.vue'), // Main Layout
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } }, // Home page
      { path: 'login', name: 'Login', component: () => import('pages/LoginPage.vue') }, // Login page
      { path: 'files', component: () => import('pages/FileSharingPage.vue'), meta: { requiresAuth: true } }, // File sharing page
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'), // 404 error page
  },
];

export default routes;
