/**
 * Created by sun77 on 2019/7/16.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const autoIncrement=require('../utils/connetMongodb');
function createdname() {
   return '用户'+Math.random().toString(36).substr(2);
}
var blogSchema = new Schema({
    phone:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
    },
    token:{
        type:String
    },
    name:{
        type:String,
        default:createdname()
    },
    avatar:{
        type:String,
        default:`http://localhost:3003/Avatar/default.jpg`
    }

});
blogSchema.plugin(autoIncrement.plugin, 'User');
var User = mongoose.model('User', blogSchema);
module.exports=User;