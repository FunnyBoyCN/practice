/**
 * Created by sun77 on 2019/7/19.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    userId:{
        type:String,
        trim:true,
        require:true
    },
    recipient:{
        type:String, //收货人姓名
        trim:true,
        require:true
    },
    province:{
        type:String, //省份
        trim:true,
        require:true
    },
    city:{
        type:String, //城市
        trim:true,
        require:true
    },
    county:{
        type:String, //区域
        trim:true,
        require:true
    },
    address:{
        type:String, //具体地址
        trim:true,
        require:true
    },
    phone:{           //收货人手机号码
        type:String,
        require:true
    },
    isDefault:{
        type:Boolean,
        default:false,
    }
});
var address = mongoose.model('Address', blogSchema);
module.exports=address;