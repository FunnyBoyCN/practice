/**
 * Created by sun77 on 2019/4/13.
 */
import {api} from "../../utils/api"
const state={
    order_no:0,
};
const mutations={
    UpdateOrder_no(state,data){
        state.order_no=data;
    },
};
const actions={
    getOrder_no(context,data){
        return api.post("/user/checkout",data).then(response=>{
            context.commit("UpdateOrder_no",response);
        })
    },
};
export default {
    namespaced:true,
    state,mutations,actions
}