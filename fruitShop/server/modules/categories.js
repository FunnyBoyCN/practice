/**
 * Created by sun77 on 2019/7/17.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    name:{
        type:String,
        trim:true,
        require:true
    }
});
var Category = mongoose.model('Category', blogSchema);
module.exports=Category;