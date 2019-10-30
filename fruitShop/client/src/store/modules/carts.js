/**
 * Created by sun77 on 2019/8/4.
 */
import Vue from 'vue'
function found(data,id) {
      return  data.find(item=>{
        return item._id==id;
    })
}
function foundIndex(data,id) {
    return  data.findIndex(item=>{
        return item._id==id;
    })
}
function LocalStorage(key,value) {
     if(localStorage.getItem(key)==null){
         const carts={
             merchandise:[],
             totalNum:0,
             totalPrice:0,
             realTotalPrice:0
         };
         localStorage.setItem('Carts',JSON.stringify(carts))
     }
     return JSON.parse(localStorage.getItem(key))[value];
}
const state= {
    merchandise:LocalStorage('Carts','merchandise'),
    totalNum:LocalStorage('Carts','totalNum'),
    totalPrice:LocalStorage('Carts','totalPrice'),
    realTotalPrice:LocalStorage('Carts','realTotalPrice'),
    show:false,
};
const mutations={
    changeMerchandise(state,data){
        const result=found(state.merchandise,data._id);
        if(!result){
            if(data.num>0){
                state.merchandise.push(data);
            }else {
                return
            }
        }else {
            let lastNum=result.num;
            let reserve=result.reserve;
            const Num=lastNum+=data.num;
            if(Num<0){
                return
            }else if(lastNum>reserve){
                Vue.prototype.Toast(`此商品仅剩${reserve}件`);
                return
            }else {
                result.num+=data.num;
                if(result.num==0){
                    const index=foundIndex(state.merchandise,result._id);
                    state.merchandise.splice(index,1);
                }
            }
        }
        const carts={
            merchandise:state.merchandise
        };
        localStorage.setItem('Carts',JSON.stringify(carts))
    },
    changeTotal(state){
        state.totalNum=0;
        state.totalPrice=0;
        state.merchandise.forEach(v=>{
            state.totalNum+=v.num;
            state.totalPrice+=(v.price*v.num);
        });
        state.totalPrice=state.totalPrice.toFixed(2);
        let carts=JSON.parse(localStorage.getItem('Carts'));
        carts.totalPrice=state.totalPrice;
        carts.totalNum=state.totalNum;
        localStorage.setItem('Carts',JSON.stringify(carts));
    },
    ClearCarts(){
        state.merchandise=[];
        state.totalNum=0;
        state.totalPrice=0;
        state.realTotalPrice=0;
        localStorage.removeItem('Carts');
        const carts={
            merchandise:[],
            totalNum:0,
            totalPrice:0,
            realTotalPrice:0
        };
        localStorage.setItem('Carts',JSON.stringify(carts))
    },
    ShowCarts(state,data){
        state.show=data;
    },
    ChangeTotalPrice(state,data){
        state.realTotalPrice=data;
        let carts=JSON.parse(localStorage.getItem('Carts'));
        carts.realTotalPrice=state.realTotalPrice;
        localStorage.setItem('Carts',JSON.stringify(carts));
    },
    shopAgain(state,data){
        state.merchandise=[];
        let carts=JSON.parse(localStorage.getItem('Carts'));
        carts.merchandise=data;
        localStorage.setItem('Carts',JSON.stringify(carts));
        state.merchandise=data;
    }
};
const actions={
   async addMerchandise(context,data){
       await context.commit('changeMerchandise',data);
       await context.dispatch('calTotal');
    },
     clearCarts(context){
         context.commit('ClearCarts');
    },
    showCarts({commit},data){
        commit('ShowCarts',data);
    },
    calTotal({commit}){
        commit('changeTotal');
    },
    changeTotalPrice({commit},data){
        commit('ChangeTotalPrice',data)
    },
    async ShopAgain(context,data){
        await context.commit('shopAgain',data);
        await context.dispatch('calTotal');
    }
};
export default{
    state,mutations,actions,
    namespaced:true,
}