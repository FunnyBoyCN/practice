/**
 * Created by sun77 on 2019/10/22.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    userId:{
        type:String,
    },
    date:{
        type:Array,
    },
    accountIntegral:{
        type:Number
    }
});
var signIns = mongoose.model('SignIn', blogSchema);
module.exports=signIns;