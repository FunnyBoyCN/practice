/**
 * Created by sun77 on 2019/7/19.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    address:{
        type:Object  //用户地址
    },
    userId:String, //用户ID
    orderNum:{
        type:String,
        default:0,
    },
    state:{          //订单状态
        type:Number,
        default:0,
    },
    carts:Array,  //商品
    createdTime:Number, //创建时间
    payTime:{
        type:Number, //支付时间
        default:0,
    },
    totalNum:Number,  //总商品数量
    totalPrice:Number,//总商品价格
});
var order = mongoose.model('Order', blogSchema);
module.exports=order;