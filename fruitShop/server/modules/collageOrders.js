/**
 * Created by sun77 on 2019/9/22.
 */
/**
 * Created by sun77 on 2019/7/12.
 */
/**
 * Created by sun77 on 2019/7/9.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    goods:{
        type:Object,//拼团商品
    },
    parentID:{
        type:mongoose.SchemaTypes.ObjectId, //拼团隶属上级 用于拼团商品详情页渲染未成团
    },
    createdId:{
        type:mongoose.SchemaTypes.ObjectId, //创建拼团订单ID
    },
    userId:{
        type:String, //用户ID
    },
    timeLimit:{
        type:Array, //提货时间
    },
    joinPeople:{
         type:Array, //参与人数
    },
    mode:{
        type:Number, //拼团模式
    },
    price:{
        type:Number, //拼团价格
    },
    pickupShop:{
        type:Object,//提货门店
    },
    state:{
        type:Number, //订单状态 0下单未付款 1已付款未成团 2已成团未提货 3已提货
        default:0,
    },
    createdTime:{
        type:Number, //订单创建时间
    },
    createdPayTime:{
        type:Number, //创建订单支付时间
    },
    cancelTime:{
        type:Number, //订单取消时间
        default:0
    },
    orderNum:{
        type:Number,  //订单号
        default:0
    },
    pickUpNum:{
        type:String,  //提货号码
        default:0
    }
});
var collageOrders = mongoose.model('CollageOrder', blogSchema);
module.exports=collageOrders;