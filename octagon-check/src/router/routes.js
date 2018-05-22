
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/aboutUs') },
      { path: 'aboutUs', name: '关于我们', component: () => import('pages/aboutUs') },
      { path: 'serviceFeature', name: '服务特色', component: () => import('pages/serviceFeature') },
      { path: 'customerVoice', name: '客户之声', component: () => import('pages/customerVoice') },
      { path: 'positionNav', name: '位置导航', component: () => import('pages/positionNav') },
      { path: 'register', name: '登记注册', component: () => import('pages/register') },
      { path: 'annualCheckOrder', name: '年审预约', component: () => import('pages/annualCheckOrder') },
      { path: 'illegalQuery', name: '违章查询', component: () => import('pages/illegalQuery') },
      { path: 'industryInfo', name: '行业咨询', component: () => import('pages/industryInfo') },
      { path: 'checkProcess', name: '检车流程', component: () => import('pages/checkProcess') },
      { path: 'orderRecord', name: '预约记录', component: () => import('pages/orderRecord') },
      { path: 'orderDetail/:id', name: '预约详情', component: () => import('pages/orderDetail') },
      { path: 'industryInfoDetail/:id', name: '行业资讯详情', component: () => import('pages/industryInfoDetail') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
