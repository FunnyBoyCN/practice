/**
 * Created by sun77 on 2019/9/10.
 */
const state={
   first:false
};
const mutations={
    changeFirst(state){
        state.first=true;
    },
};
export default {
    namespaced:true,
    state,mutations
}