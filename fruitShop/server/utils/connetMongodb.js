/**
 * Created by sun77 on 2019/7/9.
 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://fruits:1994888@47.107.134.55:27017/fruitshop',{useNewUrlParser: true });
const autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
autoIncrement.initialize(db);

db.on("error",err=>{
    console.log('连接失败')
})
db.once('open', function() {
    console.log('I am open')
});
module.exports=autoIncrement