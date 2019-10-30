/**
 * Created by sun77 on 2019/4/8.
 */
import {api} from "../../utils/api"
const state={
    menuList:[],
    leftMenuList:[],
    carousel:[],
    mainData:[],
    isHome:true,

};
const mutations={
    MenuList(state,data){
        state.menuList=data;
    },
    LeftMenuList(state,data){
        state.leftMenuList=data;
    },
    Carousel(state,data){
        state.carousel=data;
    },
    MainData(state,data){
        state.mainData=data;
    },
    IsHome(state,data){
        state.isHome=data
    },

};
const actions={
    getMenuList(context){
            api.get("/menu?type=top").then(response=>{
           context.commit("MenuList",response)
        })
    },
    getLeftMenuList(context){
        api.get("/menu?type=left").then(response=>{
            context.commit("LeftMenuList",response);
        });
    },
    getCarousel(context){
        api.get("/menu?type=carousel").then(response=>{
            context.commit("Carousel",response)
        })
    },
    getMainData(context){
      return  api.get("/menu?type=index").then(response=>{
            context.commit("MainData",response)
        })
    },
    getIsHome({commit},data){
      commit("IsHome",data)
    }
};
export default {
    namespaced:true,
    state,mutations,actions
}
