/**
 * Created by sun77 on 2019/6/22.
 */
const express =require('express');
const bodyParser = require('body-parser');
const app=express();
require('cors')();
require('./utils/connectMongoDB');
const userOrder =require('./modules/userOrder');
let jsonParser = bodyParser.json();
app.get('/getOrder',function (req,res) {   //获取用户订单列表
    const id=req.query.id;
    userOrder.find({userId:id},function (err,docs) {
        if(!err){
            res.status(200).send(docs);
        }
    })
});
function insertDataBase(data) {   //添加用户订单到数据库方法
    let userOrder =new userOrder(data);
    userOrder.save();
}
app.post('/PostOrder',jsonParser,function (req,res) {  //添加用户订单
    let result=req.body;
    function toTypeOf(target) {
        return Object.prototype.toString.call(target).split(' ')[1].split(']')[0];
    }
    if (toTypeOf(result.userId)!=='Number'
        &&toTypeOf(result.Order)!=='String'
        &&toTypeOf(result.state)!=='Number'
        &&toTypeOf(result.ShopContent)!=='Array'
        &&toTypeOf(result.time)!=='Number'){
        res.status(400).send({ error: '错误的参数' });
    }else {
        insertDataBase(result);
        res.status(200).send("添加成功");
    }
});
app.post('/UpdateOrder',jsonParser,function (req,res) {  //更新用户订单 传入订单id
    let id=req.body.Orderid;
    userOrder.findByIdAndUpdate(id,{state:1},function () {
        res.send('支付成功')
    })
});
app.listen(3003);