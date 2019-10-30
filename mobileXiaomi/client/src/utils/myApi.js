/**
 * Created by sun77 on 2019/6/20.
 */
import axios from "axios";
import Vue from "vue"
const  myApi =axios.create({
    // baseURL:'http://localhost:4000',
    baseURL:'http://47.107.134.55:4000',
});
myApi.interceptors.request.use(
    config =>{
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);
myApi.interceptors.response.use(response=>{
    return response.data
},error => {
    if(!error.config._slient){
        Vue.prototype.$notify({
            type:"error",
            color:'white',
            background:'red',
            message:error.message
        });
        return Promise.reject(error);
    }
});
export {myApi}