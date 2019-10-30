import Vue from 'vue'
import Vuex from 'vuex'
import carts from './modules/carts'
import tabbar from './modules/tabbar'
import distance from './modules/distance'
import user from './modules/user'
import share from './modules/share'
import payPassword from './modules/payPassword'
import firstCheck from './modules/firstCheck'
import payMode from './modules/payMode'
import pay from './modules/pay'
import collageOrderDetail from './modules/collageOrderDetail'
import networkError from './modules/networkError'
import nearbyShop from './modules/nearbyShop'
import searchHistory from './modules/searchHistory'
import myPosition from './modules/myPostition'
import {api} from '../utils/api'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);
export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
   modules:{
       carts,
       tabbar,
       distance,
       user,
       share,
       payPassword,
       firstCheck,
       payMode,
       pay,
       collageOrderDetail,
       networkError,
       nearbyShop,
       searchHistory,
       myPosition
   },
    plugins:[
        createPersistedState({
            key: 'User',
            paths: ['user'],
            subscriber(store){
                if(store.state.user.userInfo.token){
                    api.defaults.headers.common['Token']=store.state.user.userInfo.token;
                    store.dispatch("user/checkLoginAction");
                }
                return function (handler) {
                    return store.subscribe(handler)
                }
            }
        })
    ]
})
