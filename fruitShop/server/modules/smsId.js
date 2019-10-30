/**
 * Created by sun77 on 2019/7/16.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    code:{
        type:String
    },
    time:{
      type:Number
    }

});
var Code = mongoose.model('Code', blogSchema);
module.exports=Code;