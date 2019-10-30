/**
 * Created by sun77 on 2019/10/14.
 */
function LocalStorage(key,value) {
    if(localStorage.getItem(key)==null){
        const nearbyShop={
            name:'',
            id:'',
            address:'',
            opening:'',
        };
        localStorage.setItem('NearbyShop',JSON.stringify({nearbyShop}))
    }
    return JSON.parse(localStorage.getItem(key))[value];
}
const state={
    nearbyShop:LocalStorage('NearbyShop','nearbyShop')
};
const mutations={
    changeNearbyShop(state,data){
        state.nearbyShop=data;
        let nearbyShop=(JSON.parse(localStorage.getItem('NearbyShop'))).nearbyShop;
        nearbyShop.name=data.name;
        nearbyShop.id=data.id;
        nearbyShop.address=data.address;
        nearbyShop.opening=data.opening;
        localStorage.setItem('NearbyShop',JSON.stringify({nearbyShop}));
    }
};
const actions={
    ChangeNearbyShop({commit},data){
        commit('changeNearbyShop',data);
    }
};
export default {
    namespaced:true,
    state,mutations,actions
}