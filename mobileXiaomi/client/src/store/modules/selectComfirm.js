/**
 * Created by sun77 on 2019/5/13.
 */
const state={
    ms:{
        selectShopMs:[],
        userAdMs:{

        }
    }
};
const mutations={
    changeMs(state,data){
        state.ms.selectShopMs=data.selectShopMs;
        state.ms.userAdMs=data.userAdMs
    }
};
const actions={
    disChangeMs({commit},data){
        commit("changeMs",data)
    }
};
export default {
    namespaced:true,
    state,mutations,actions
}