/**
 * Created by sun77 on 2019/10/13.
 */
const state={
    reloadShow:false,
};
const mutations={
    reloadShow(state,data){
        state.reloadShow=data;
    }
};
const actions={
    changeReloadShow({commit},data){
        commit('reloadShow',data);
    }
};
export default {
    namespaced:true,
    state,mutations,
    actions
}