import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import animated from 'animate.css'
import VeeValidate,{ Validator } from 'vee-validate';
import {Notify} from 'vant'
import  'vant/lib/notify/style'
import zhCN from 'vee-validate/dist/locale/zh_CN';
Vue.use(VeeValidate);
Vue.use(animated);
Vue.use(Notify);
Vue.$notify=Notify;
Vue.config.productionTip = false;
Validator.localize('zhCN', zhCN);
router.beforeEach(function (to, from, next) {
    store.commit('loading/sLoadingState', true);
    window.screenTop=0;
    next();
});
router.afterEach(function () {
    const timer=setTimeout(function () {
        store.commit('loading/sLoadingState', false);
        clearTimeout(timer)

    },500)

});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
