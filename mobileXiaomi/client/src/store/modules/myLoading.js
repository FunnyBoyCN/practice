/**
 * Created by sun77 on 2019/7/3.
 */
const  state={
    LoadingState:false,
};
const mutations={
    sLoadingState(state,data){
        state.LoadingState=data;
    }
};
const actions={
    changeLoadingState({commit},data){
        commit('sLoadingState',data)
    }
};
export  default{
    namespaced:true,
    state,mutations,actions
}