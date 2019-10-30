/**
 * Created by sun77 on 2019/7/30.
 */
import Vue from "vue"
import axios from 'axios'
import router from '../router'
import loading from './loading'
import {Toast} from 'vant'
const  api =axios.create({
    baseURL:'http://47.107.134.55:4004/user/api',
});
api.interceptors.request.use(
    config =>{
        loading.showFullScreenLoading();
        if(config.params){
           if(config.params.noLoading){
               loading.tryHideFullScreenLoading();
           }
        }
        return config;
    },
    (error) => {
        loading.tryHideFullScreenLoading();
        return Promise.reject(error)
    }
);
api.interceptors.response.use(response=>{
    loading.tryHideFullScreenLoading();
    return response.data.data
},error => {
    loading.tryHideFullScreenLoading();
    if(error){
        if (!error.response) {
            router.push({
                path:'/networkError',
            });
            Toast.fail('加载失败');
            return false
        }
        const statusCode=error.response.status;
        const errorMessage=error.response.data.data.message;
       if(statusCode==403&&error.response.data.data.logout==true){
            router.push({
                        path:'/notLogin',
                        query:{
                        tokenOverdue:true,
                        message:errorMessage
                    }
                    });
                    return ;
        }else {
            if(!JSON.parse(error.config.data)._slient) {
                   Vue.prototype.Notify(errorMessage);
              }
        }
    }
    return Promise.reject(error);
});
export {api}