import Vue from 'vue'
import Router from 'vue-router'
import home from './views/Home/Home.vue'
import Collage from './views/Collage/Collage.vue'
Vue.use(Router);

const router= new Router({
   mode: 'hash',
   base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      meta:{
         showCarts:true
      },
       component:home
    },
      {
          path: '/activityDetail',
          name: 'activityDetail',
          meta:{
              hiddenNav:true
          },
          component:()=>import('./views/Home/activityDetail.vue')
      },
      {
          name:'404',
          path:'/404',
          meta:{
              hiddenNav:true,
          },
          component:()=>import('./views/notFound.vue')
      },
      {
          name:'search',
          path:'/search',
          meta:{
              hiddenNav:true,
              showCarts:true
          },
          children:[
              {
                  path:'pendingSearch',
                  name:'pendingSearch',
                  component:()=>import('./views/Search/pendingSearch.vue')
              },
              {
                  path:'searchResult',
                  name:'searchResult',
                  component:()=>import('./views/Search/searchResult.vue'),
                  meta:{
                      showCarts:true
                  }
              }
          ],
          component:()=>import('./views/Search/search.vue')
      },
    {
      path: '/Collage',
      name: 'Collage',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Collage
    },
      {
          path: '/Collage/detail',
          name: 'CollageDetail',
          meta:{
            hiddenNav:true,
            index:1
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Collage/collageDetail.vue')
      },
      {
          path: '/Collage/checkout',
          name: 'collageCheckout',
          meta:{
              hiddenNav:true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Collage/collageCheckout.vue')
      },
      {
          path: '/Collage/checkout/paySuccess',
          name: 'paySuccess',
          meta:{
              hiddenNav:true,
              requireLogin:true,
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Collage/paySuccess.vue')
      },
      {
          path: '/Orders',
          name: 'Orders',
          meta:{
              requireLogin:true,
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          children:[{
              path: 'timelyOrder',
              name:'timelyOrder',
              component: ()=>import('./views/Orders/views/timelyOrder.vue'),
              alias: '/Orders',
              meta:{
                  requireLogin:true,
              }
          }, {
             path: 'collageOrder',
             name:'collageOrder',
             component: ()=>import('./views/Orders/views/collageOrder.vue'),
              alias: '/Orders',
              meta:{
                  requireLogin:true,
              }
             }
          ],
          component: () => import(/* webpackChunkName: "about" */ './views/Orders/Orders.vue')
      },
      {
          path: '/Orders/timelyOrder/detail',
          name:'timelyOrderDetail',
          component: ()=>import('./views/Orders/views/timelyOrderDetail.vue'),
          meta:{
              requireLogin:true,
              hiddenNav:true
          }
      },
      {
          path: '/Orders/collageOrder/detail',
          name:'collageOrderDetail',
          component: ()=>import('./views/Orders/views/collageOrderDetail.vue'),
          meta:{
              requireLogin:true,
              hiddenNav:true
          }
      },
      {
          path:'/Login',
          name:'Login',
          alias:'/Member/Login',
          meta:{
              hiddenNav:true,
          },
          component:()=>import('./views/Member/Login.vue')
      },
      {
          path: '/Member',
          name: 'Member',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Member/Member.vue')
      },
      {
          path: '/ownInfo',
          name: 'ownInfo',
          meta:{
              hiddenNav:true,
              requireLogin:true,
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Member/ownInfo.vue')
      },
      {
          path: '/Member/singIn',
          name: 'singIn',
          meta:{
              hiddenNav:true,
              requireLogin:true,
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Member/signIn.vue')
      },
      {
          path: '/Member/setting',
          name: 'setting',
          meta:{
              hiddenNav:true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Member/setting.vue')
      },
      {
          path:'/editPassword',
          name:'editPassword',
          meta:{
              hiddenNav:true,
              requireLogin:true
          },
          component:()=>import('./views/Member/editPassword.vue')
      },
      {
         path:'/memberCode',
          name:'memberCode',
          meta:{
              requireLogin:true,
              hiddenNav:true
          },
          component:()=>import('./views/Common/memberCode.vue')
      },
      {
          path:'/account',
          name:'account',
          meta:{
              requireLogin:true,
              hiddenNav:true,
              checkPayPassword:true,
          },
          component:()=>import('./views/Member/account.vue')
      },
      {
          path:'/account/balanceDetail',
          name:'balanceDetail',
          meta:{
              requireLogin:true,
              hiddenNav:true
          },
          component:()=>import('./views/Member/balanceDetail.vue')
      },
      {
          path:'/editPayPassword',
          name:'editPayPassword',
          meta:{
              requireLogin:true,
              hiddenNav:true,
          },
          component:()=>import('./views/Common/editPayPassword.vue')
      },
      {
          path:'/checkPayPassword',
          name:'checkPayPassword',
          meta:{
              requireLogin:true,
              hiddenNav:true,
          },
          component:()=>import('./views/Common/checkPayPassword.vue')
      },
      {
          path:'/notLogin',
          name:'notLogin',
          hiddenNav:true,
          component:()=>import('./views/Common/notLogin.vue')
      },
      {
          path: '/goodsDetail',
          name: 'goodsDetail',
          meta:{
              hiddenNav:true,
              showCarts:true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Common/goodsDetail.vue')
      },
      {
          path: '/address',
          name: 'address',
          meta:{
              hiddenNav:true,
              requireLogin:true,
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Common/address.vue')
      },
      {
          path: '/address/editAddress',
          name: 'editAddress',
          meta:{
              hiddenNav:true,
              requireLogin:true,
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Common/editAddress.vue')
      },
      {
          path: '/checkout',
          name: 'checkout',
          meta:{
              hiddenNav:true,
              requireLogin:true,
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Common/checkout.vue')
      },
      {
          path: '/nearbyShop',
          name: 'nearbyShop',
          meta:{
              hiddenNav:true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Shop/nearbyShop.vue')
      },
      {
          path: '/shopMapDetail',
          name: 'shopMapDetail',
          meta:{
              hiddenNav:true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/Shop/shopMapDetail.vue')
      },
      {
          path: '/networkError',
          name: 'networkError',
          meta:{
              hiddenNav:true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/networkFail/networkError.vue')
      },
      {
          path:'*',
          redirect:'/404'
      }
  ]
});
export default router;
