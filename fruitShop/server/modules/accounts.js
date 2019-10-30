/**
 * Created by sun77 on 2019/9/5.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    userId:{
        type:String,
        trim:true,
        require:true
    },
    balance:{
        type:Number,
        default:0,
    }
});
var accounts = mongoose.model('Account', blogSchema);
module.exports=accounts;