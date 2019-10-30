/**
 * Created by sun77 on 2019/6/13.
 */
//创建集合
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    userId:Number,
    Order:String,
    state:{
        type:Number,
        default:0,
    },
    ShopContent:Array,
    time:Number,
});
var MyOrder = mongoose.model('Myorder', blogSchema);
module.exports=MyOrder;