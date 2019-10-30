/**
 * Created by sun77 on 2019/9/10.
 */
const  state={
    isOld:true,
};
const mutations={
    changeIsOld(state,data){
        state.isOld=data;
    },
    reload(state){
        state.isOld=false;
    }
};
const actions={
    ChangeIsOld({commit},data){
       commit('changeIsOld',data)
    },
    Reload({commit}){
        commit('reload')
    }
};
module.exports={
    state,mutations,actions,
    namespaced:true,
}