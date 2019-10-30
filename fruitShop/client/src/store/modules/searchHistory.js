/**
 * Created by sun77 on 2019/10/21.
 */
function LocalStorage(key,value) {
    if(localStorage.getItem(key)==null){
        const search=[];
        localStorage.setItem('Search',JSON.stringify({search}))
    }
    return JSON.parse(localStorage.getItem(key))[value];
}
const state={
    search:LocalStorage('Search','search')
}
const mutations={
    changeSearch(state,data){
       if(state.search.includes(data)){
          return false
       }else {
          let oSearch=JSON.parse(localStorage.getItem('Search'));
          let search=oSearch.search;
           state.search.push(data);
           search.push(data);
           localStorage.setItem('Search',JSON.stringify({search}))
       }
    },
    clear(state){
        state.search=[];
        const search=[];
        localStorage.setItem('Search',JSON.stringify({search}))
    }

}
const actions={
    ChangeSearch({commit},data){
        commit('changeSearch',data);
    },
    Clear({commit}){
        commit('clear');
    }
}
export default {
    namespaced:true,
    state,mutations,actions
}