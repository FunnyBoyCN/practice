import {api} from "../../utils/api"
import {myApi} from '../../utils/myApi'
const state={
    isLoginEnter:true,
    isLogin:false,
    user:{

    },
    ShopCartNum:0,
    shopCartContent:[],
    isMobile:false,
    userAddMs:[],
    chooseAddId:'',
    userId:0,
    notPayNum:[],
    allPayNum:[],
    payNum:[],
};
const mutations={
    IsMobile(state,data){
        state.isMobile=data;
    },
    changeLoginEnter(state,data){
        state.isLoginEnter=data;
    },
    Logined(state,data){
        state.isLogin=true;
        state.user=data;
       api.defaults.headers.common['Token']=state.user.token;
        api.get('/user/getUserInfo').then(res=>{
            state.userId=+res.id;
        });
    },
    getOrderNum(state,id){ //设置订单数字
        state.notPayNum=[];
        state.allPayNum=[];
        state.payNum=[];
        myApi.get(`/getOrder?id=${id}`).then(res=>{
            state.allPayNum=res;
            res.forEach((v)=>{
                if(v.state===0){
                    state.notPayNum.push(v);
                }
                if(v.state===1){
                    state.payNum.push(v);
                }
            })
        });
    },
    Logout(state){
        state.isLogin=false;
        state.user={};
        state.ShopCartNum=0;
        state.shopCartContent=[];
        api.defaults.headers.common['Token']='';
        state.userAddMs=[];
        state.chooseAddId='';
        state.userId=0;
        state.notPayNum=[];
        state.allPayNum=[];
        state.payNum=[];
    },
    shopCartNum(state,data){
        state.ShopCartNum=0;
        for(let i=0;i<data.length;i++){
            state.ShopCartNum+=+(data[i].quantity);
        }
        state.shopCartContent=data;
        state.shopCartContent.forEach((v)=>{
            v.isSelected=false;
        })
    },
    CarChange(state,data){
        state.ShopCartNum=0;
        for(let i=0;i<data.length;i++){
            state.ShopCartNum+=+(data[i].quantity);
        }
    },
    // 用户地址设置
    setUserAddress(state,data){
        state.userAddMs=data;
       if(state.chooseAddId===''&&state.userAddMs.length>0){
           state.chooseAddId=state.userAddMs[0].address_id;
       }
    },
    setDefaultChooseAddress(state,id){
        state.chooseAddId=id;
    },
    changeChoose(state,id){
        state.userAddMs.forEach((v)=>{
            v.isChoose=false;
            if(v.address_id===id){
                v.isChoose=true
            }
        })

    }
};
const actions={
    loginEnter(context,data){
        context.commit("changeLoginEnter",data)
    },
    login(context,data){
       return api.post("/login",data).then(response=>{
           context.dispatch('getOrderNum',response.id)
           context.commit("Logined",response);
       })
    },
    logout(context){
        context.commit("Logout");
    },
    register(context,data){
        return api.post("/register",data).then(response=>{
            context.dispatch('getOrderNum',response.id);
            context.commit("Logined",response);
        })
    },
    getShopCart(context){
        return api.get("/user/cart",{_slient:true}).then(response=>{
            context.commit("shopCartNum",response);
        })
    },
    getCarChange(context){
        api.get("/user/cart",{_slient:true}).then(response=>{
            context.commit("CarChange",response);
        })
    },
    changeShopCart(context,data){
        api.post("/user/updateCart",data).then(()=>{
            context.dispatch("getCarChange")
       });
    },
   // 用户地址设置
    getUserAddress({commit}){
        return api.get("/user/addressList").then(response=>{
            commit('setUserAddress',response)
        });
    },
    changeDefaultChooseAddress({commit},id){
        commit('setDefaultChooseAddress',id)
    },
    changeChooseAddress({commit},id){
        commit('changeChoose',id)
    },
    //获取订单数字
    getOrderNum({commit},id){
        commit('getOrderNum',id)
    }
};
export default {
    namespaced:true,
    state,mutations,actions
}
