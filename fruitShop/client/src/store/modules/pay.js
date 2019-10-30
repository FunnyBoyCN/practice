/**
 * Created by sun77 on 2019/9/20.
 */
const state={
    showPayMode:false,
    payId:'',
    payPrice:0,
};
const mutations={
    changePayShow(state,data){
        state.showPayMode=data;
    },
    changePayId(state,data){
        state.payId=data;
    },
    changePayPrice(state,data){
        state.payPrice=data;
    },
    clear(state){
        state.showPayMode=false;
        state.payId='';
        state.payPrice=0;
    }
};
const actions={
    ChangePayShow({commit},data){
        commit('changePayShow',data)
    },
    ChangePayId({commit},data){
        commit('changePayId',data)
    },
    ChangePayPrice({commit},data){
        commit('changePayPrice',data)
    },
    Clear({commit}){
        commit('clear')
    },
};
module.exports={
    namespaced:true,
    state,mutations,actions
};