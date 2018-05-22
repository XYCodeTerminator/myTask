import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Users from '@/components/Users'
import Roles from '@/components/Roles'
import BookManage from '@/components/BookManage'
import Test from '@/components/Test'
import BookDetailEdit from '@/components/BookDetailEdit'
import BookDisplay from '@/components/BookDisplay'
import BookDetail from '@/components/BookDetail'
import BookCollect from '@/components/BookCollect'
import BookSubscribe from '@/components/BookSubscribe'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: Login
    },
    {
      path: '/register',
      name: '注册',
      component: Register
    },
    {
      path: '/outTest',
      name: '测试页',
      component: Test
    },
    {
      path: '/main',
      name: '主页',
      component: Main,
      children: [
        {
          path: 'inTest',
          name: '内部测试页',
          component: Test,
        },
        {
          path: 'users',
          name: '用户管理',
          component: Users,
        },
        {
          path: 'roles',
          name: '角色管理',
          component: Roles,
        },
        {
          path: 'bookManage',
          name: '图书管理',
          component: BookManage
        },
        {
          path: 'bookDetailEdit',
          name: '图书详细编辑',
          component: BookDetailEdit
        },
        {
          path: 'bookDisplay',
          name: '图书一览',
          component: BookDisplay
        },
        {
          path: 'bookDisplay/:id',
          name: '图书详情',
          component: BookDetail
        },
        {
          path: 'myCollectBooks',
          name: '我的收藏',
          component: BookCollect
        },
        {
          path: 'mySubscribeBooks',
          name: '我的订阅',
          component: BookSubscribe
        }
      ]
    },
    { path: '*', redirect: '/' }
  ]
})
