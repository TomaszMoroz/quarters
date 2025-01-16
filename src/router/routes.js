const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('layouts/MainLayout.vue'), // Main Layout
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } }, // Home page
      { path: 'login', name: 'Login', component: () => import('pages/LoginPage.vue') }, // Login page
      { path: 'files', component: () => import('pages/FileSharingPage.vue'), meta: { requiresAuth: true } },
      { path: 'fetch', component: () => import('pages/FetchFiles.vue'), meta: { requiresAuth: true } },
      { path: 'inbox', component: () => import('pages/InBox.vue'), meta: { requiresAuth: true } },
      { path: 'create', component: () => import('pages/DocCreator.vue'), meta: { requiresAuth: true } },
      { path: 'send', component: () => import('pages/SendFile.vue'), meta: { requiresAuth: true } },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'), // 404 error page
  },
];

export default routes;
