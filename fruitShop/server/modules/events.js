/**
 * Created by sun77 on 2019/10/24.
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    contents:{
        type:Array,
    },
    headerImg:{
        type:String,
    },
    contentText:{
        type:String
    }
});
var events = mongoose.model('Event', blogSchema);
module.exports=events;