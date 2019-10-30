/**
 * Created by sun77 on 2019/6/13.
 */
const mongoose = require('mongoose');
// mongoose.connect('mongodb://cccc:123@47.107.134.55:27017/Demo',{useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/dayOne',{useNewUrlParser: true });
var db = mongoose.connection;
db.on("error",err=>{
    console.log('连接失败')
})
db.once('open', function() {
    console.log('I am open')
});