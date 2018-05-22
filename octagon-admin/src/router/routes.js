
export default [
  {
    path: '/',
    component: () => import('pages/login')
  },

  {
    path: '/main',
    component: () => import('layouts/default')
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
