/**
 * Created by sun77 on 2019/4/7.
 */
import axios from "axios";
import Vue from "vue"
import myLoading from './loading'
const  api =axios.create({
    baseURL:'https://vip.chanke.xyz/mi',
});
api.interceptors.request.use(
    config =>{
        myLoading.showFullScreenLoading();
        return config;
    },
    error => {
        myLoading.tryHideFullScreenLoading();
        return Promise.reject(error)
    }
);
api.interceptors.response.use(response=>{
    myLoading.tryHideFullScreenLoading();
    return response.data.data
},error => {
    myLoading.tryHideFullScreenLoading();
    if(!error.config._slient){
        Vue.prototype.$notify({
            type:"error",
            color:'white',
            background:'red',
            message:error.response.data.errorMessage||'网络异常'
        });
        return Promise.reject(error);
    }
});
export {api}