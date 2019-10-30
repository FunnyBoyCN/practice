import Vue from 'vue'
import Vuex from 'vuex'
import render from "./modules/render"
import userMs from "./modules/userMs"
import userShopCar from "./modules/userShopCar"
import productDetail from "./modules/productDetail"
import userOrder_no from "./modules/userOrder_no"
import createPersistedState from 'vuex-persistedstate'
import selectComfirm from './modules/selectComfirm'
import loading from './modules/myLoading'
import {api} from "../utils/api"
Vue.use(Vuex);
export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
    plugins: [createPersistedState({
        key:"appXiaoMi",
        paths:["userMs"],
        subscriber:store=>{
            if(store.state.userMs.user.token){
                api.defaults.headers.common['Token']=store.state.userMs.user.token;
                store.dispatch("userMs/getShopCart");
            }
            return handler => store.subscribe(handler)
        }

    })],
    modules:{
        render,
        userMs,
        userShopCar,
        productDetail,
        userOrder_no,
        selectComfirm,
        loading
    }
})
