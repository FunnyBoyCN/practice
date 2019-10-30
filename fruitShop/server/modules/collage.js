/**
 * Created by sun77 on 2019/7/26.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    goodsContent:{
        type:Object,
        trim:true,
    },
    mode:{
      type:Number, //拼团形式
    },
    Price:{
        type:String, //拼团价格
    },
    timeLimit:{
        type:Array, //活动期限
    },
    groups:{
        type:Number,  //已成团组
        default:0
    },
    enableGroups:{
        type:Number,  //可拼团组
    }
});
var collages = mongoose.model('Collage', blogSchema);
module.exports=collages;