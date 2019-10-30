/**
 * Created by sun77 on 2019/8/6.
 */
const state={
    isHidden:false,
    name:''
};
const mutations={
    ChangeHidden(state,data){
        state.isHidden=data;
    },
    ChangeTabbarName(state,data){
        state.name=data;
    }
};
const actions={
    changeHidden({commit},data){
        commit('ChangeHidden',data)
    },
    changeTabbarName({commit},data){
      commit('ChangeTabbarName',data);
    }
};
export default {
    namespaced:true,
    state,mutations,actions
}