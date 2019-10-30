import Vue from 'vue'
import Router from 'vue-router'
import home from "./views/home.vue"
Vue.use(Router)
 const router=new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/',
          name: 'home',
          component: home
      },
      {
          path: '/classify',
          name: 'classify',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/classify.vue')
      },
      {
          path: '/shopDetail',
          name: 'shopDetail',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/shopDetail.vue')
      },
      {
          path: '/mine',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/mine.vue')
      },
      {
          path: '/shopCar',
          name: 'shopCar',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/shopCar.vue')
      },
      {
          path: '/MobileCheckOut',
          name: 'MobileCheckOut',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/MobileCheckOut.vue')
      },
      {
          path: '/AddressEdit',
          name: 'AddressEdit',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/AddressEdit.vue')
      },
      {
          path: '/myOrder',
          name: 'myOrder',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/myOrder.vue')
      },
      {
          path: '/OrderDetail',
          name: 'OrderDetail',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/OrderDetail.vue')
      },
      {
          path: '/Appraise',
          name: 'Appraise',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/Appraise.vue')
      },
      {
          path: '/MyComment',
          name: 'MyComment',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/MyComment.vue')
      }, {
          path: '/shopComment',
          name: 'shopComment',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.

          component:() => import('./views/shopComment.vue')
      },
      {
          path: '/Search',
          name: 'Search',
          children: [
              {
                  path: '/Search/list',
                  component: () => import('./views/list.vue')
              },
          ],
          component:() => import('./views/Search.vue')
      }
  ]
});
export default router;