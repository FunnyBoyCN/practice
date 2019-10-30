/**
 * Created by sun77 on 2019/7/15.
 */
const mongoose = require('mongoose');
const autoIncrement=require('../utils/connetMongodb')
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    number:{
        type:Schema.Types.ObjectId,
    },
});
blogSchema.plugin(autoIncrement.plugin, 'Count');
var Count = mongoose.model('Count', blogSchema);
module.exports=Count;