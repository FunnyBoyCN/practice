/**
 * Created by sun77 on 2019/10/14.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    name:{
        type:String,
    },
    address:{
        type:String,
    },
    city:{
        type:String,
    },
    opening:{
        type:String,
    }
});
var shops = mongoose.model('Shop', blogSchema);
module.exports=shops;