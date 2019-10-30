/**
 * Created by sun77 on 2019/7/9.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    name:String,
    password:String,
    token:String,
});
var adminUser = mongoose.model('adminUser', blogSchema);
module.exports=adminUser;