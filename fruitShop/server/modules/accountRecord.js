/**
 * Created by sun77 on 2019/9/6.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    userId:{
        type:String,
        trim:true,
        require:true
    },
    des:{
        type:String,
        trim:true,
    },
    num:{
        type:Number,
        default:0,
    },
    createdTime:{
        type:Number
    }
});
var accountRecords = mongoose.model('AccountRecord', blogSchema);
module.exports=accountRecords;