/**
 * Created by sun77 on 2019/8/8.
 */
const state={
    distanceX:0,
    distanceY:0,

};
const mutations={
    changeDistance(state,data){
        state.distanceX=data.distanceX;
        state.distanceY=data.distanceY;
    },
};
const actions={
};
export default {
    namespaced:true,
    state,mutations,actions
}