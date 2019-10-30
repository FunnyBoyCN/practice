/**
 * Created by sun77 on 2019/10/27.
 */
function LocalStorage(key,value) {
    if(localStorage.getItem(key)==null){
        const position={
            lng:NaN,
            lat:NaN,
            text:''
       }
        localStorage.setItem('Position',JSON.stringify({position}))
    }
    return JSON.parse(localStorage.getItem(key))[value];
}
const state={
    position:LocalStorage('Position','position'),
};
const mutations={
    changePosition(state,data){
        let  position=JSON.parse(localStorage.getItem('Position')).position;
        position.lng=data.lng;
        position.lat=data.lat;
        position.text=data.text;
        state.position.lng=data.lng;
        state.position.lat=data.lat;
        state.position.text=data.text;
        localStorage.setItem("Position",JSON.stringify({position}))
    }
};
const actions={
    ChangePosition({commit},data){
        commit('changePosition',data);
    }
};
export default {
    namespaced:true,
    actions,mutations,state,
}
