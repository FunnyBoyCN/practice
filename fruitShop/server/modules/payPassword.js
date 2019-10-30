/**
 * Created by sun77 on 2019/9/10.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
     password:{
         type:Number,
         require:true
     },
     userId:{
        type:String,
        trim:true,
        require:true
     }
});
var payPasswords = mongoose.model('PayPassword', blogSchema);
module.exports=payPasswords;