/**
 * Created by sun77 on 2019/8/20.
 */
const state={
    share:{

    }
};
const mutations={
    createdShare(state,data){
        state.share=data;
    },
    clearShare(state){
        state.share={}
    }
}
const actions={
    CreatedShare({commit},data){
        commit('createdShare',data);
    },
    ClearShare({commit}){
        commit('clearShare');
    },
    GetShare({commit}){
        commit('getShare')
    }
}
export default {
    state,mutations,actions,
    namespaced:true,
}