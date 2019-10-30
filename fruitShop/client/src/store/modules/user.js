/**
 * Created by sun77 on 2019/8/6.
 */
import {api} from '../../utils/api'
const state={
    isLogin:false,
    userInfo:{

    }
};
const mutations={
    login(state,data){
        state.userInfo=data;
        state.isLogin=true;
        api.defaults.headers.common['Token']=state.userInfo.token;
    },
    logout(state){
        state.userInfo={};
        state.isLogin=false;
        api.defaults.headers.common['Token']='';
    },
};
const actions={
    loginAction({commit},data){
        commit('login',data)
    },
    logoutAction({commit}){
        commit('logout');
    },
    checkLoginAction({commit}){
        api.post('/checkToken',{_slient:true}).then(res=>{

        },err=>{
            console.log(err)
            commit('logout')
        })
    }
};
export default {
    namespaced:true,
    state,mutations,actions
}
