/**
 * Created by sun77 on 2019/9/16.
 */
const state={
    mode:'memberWallet'
};
const mutations={
    changePayMode(state,data){
        state.mode=data;
    }
};
const actions={
    ChangePayMode({commit},data){
        commit('changePayMode',data)
    }
};
module.exports={
    namespaced:true,
    state,mutations,actions
};