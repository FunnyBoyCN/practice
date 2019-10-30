/**
 * Created by sun77 on 2019/10/2.
 */
import {api} from '../../utils/api'
const state={
    collageOrderDetail:{

    }
};
const mutations={
    renderOrder(state,data){
        state.collageOrderDetail=data;
    },
    clearOrder(state){
        state.collageOrderDetail={}
    }
};
const actions={
    OrderDetail({commit},data){
       return api.get(`/getCollageOrder?id=${data}`).then(res=>{
            commit('renderOrder',res);
        });
    },
    clear({commit}){
        commit('clearOrder')
    }
};
export default {
    namespaced:true,
    state,mutations,actions
}