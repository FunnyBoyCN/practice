/**
 * Created by sun77 on 2019/10/20.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    userId:String, //用户ID
    codeNum:{
        type:String,
    }
});
var MemberCodes = mongoose.model('MemberCode', blogSchema);
module.exports=MemberCodes;