import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)
// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index')
  },
  {
    path: '/',
    name: 'layout',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index'),
    meta: { requireAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index')
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */'@/views/course/create')
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        props: true,
        component: () => import(/* webpackChunkName: 'course-edit' */'@/views/course/edit')
      },
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        props: true,
        component: () => import(/* webpackChunkName: 'course-section' */'@/views/course/section')
      },
      {
        path: '/course/:courseId/:courseName/:theme/video',
        name: 'course-video',
        props: true,
        component: () => import(/* webpackChunkName: 'course-video' */'@/views/course/video')
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create')
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'edit' */'@/views/menu/edit')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        props: true,
        component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/alloc-menu')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    console.log('需要验证')
    if (!store.state.user) {
      return next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
    next()
  } else {
    next()
  }
})

export default router
