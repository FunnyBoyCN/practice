/**
 * Created by sun77 on 2019/7/12.
 */
/**
 * Created by sun77 on 2019/7/9.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    name:{
        type:String,
        trim:true,
        require:true
    },
    desc:{
        type:String, //描述
        trim:true,
    },
    spec:{
        type:String, //规格
        trim:true,
    },
    price:{
        type:String, //价格
    },
    realPrice:{
        type:String, //优惠价格
    },
    reserve:{
        type:Number, //库存
    },
    Exp:{
        type:String  //保质期
    },
    goodsImg:{
        type:Array //商品图片
    },
    parentID:{
        type:mongoose.SchemaTypes.ObjectId,
    }
});
var goods = mongoose.model('Good', blogSchema);
module.exports=goods;