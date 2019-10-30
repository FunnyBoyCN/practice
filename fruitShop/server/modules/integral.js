/**
 * Created by sun77 on 2019/10/20.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    userId:String, //用户ID
    integral:{
        type:Number,
        default:0
    }
});
var Integrals = mongoose.model('Integral', blogSchema);
module.exports=Integrals;