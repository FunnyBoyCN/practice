import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import {Toast,Notify,Dialog} from 'vant'
import 'vant/lib/index.css';
import animated from 'animate.css'
Vue.use(animated).use(Dialog);
Vue.prototype.Toast=Toast;
Vue.prototype.Notify=Notify;
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireLogin)){
        const data=JSON.parse(localStorage.getItem('User'));
        if (data.user.isLogin) {
            next();
        } else {
            next({
                path: '/notLogin'
            })
        }
    }else {
        next();
    }
    if(to.matched.some(record=>record.meta.hiddenNav)){
        store.dispatch('tabbar/changeHidden',true);
        next();
    }else {
        store.dispatch('tabbar/changeHidden',false);
        next();
    }
   if(to.meta.showCarts){
       store.dispatch('carts/showCarts',true);
       next();
   }else {
       store.dispatch('carts/showCarts',false);
       next();
   }

});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
