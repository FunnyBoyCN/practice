/**
 * Created by sun77 on 2019/7/22.
 */
const adminUser=require('../modules/adminUser');
const createToken=require('../utils/user/createToken');
const category=require(`../modules/categories`)
var jwt = require('jsonwebtoken');
const secret = 'mySecret';
function updateToken(condition,token,res) {
    adminUser.updateOne(condition,{token:token},function (err) {
        if(!err){
            adminUser.find(condition,function (err,docs) {
                if(!err){
                    res.send({
                        data:docs[0],
                        message:'登录成功'
                    })
                }
            })
        }
    })
}
class admin{
    login(req,res){
            const user={
                name:req.body.name,
                password:req.body.password,
            };
        adminUser.find({name:user.name},async function (err,docs) {
                if(!err){
                    if(docs.length===0){
                        res.status(401).send({
                            message:'用户不存在'
                        })
                    }else {
                        if(docs[0].password===user.password){
                            let token;
                            if(req.body.isAuto){
                                token=await createToken(user,(60*60*24*7*1000),secret);
                            }else {
                                token=await createToken(user,(60*60*24*1000),secret);
                            }
                            updateToken({name:user.name},token,res);
                        }else {
                            res.status(401).send({
                                message:'密码错误'
                            })
                        }
                    }
                }
            })

    }
    loginCheckToken(req,res){
              const token=req.headers.token;
              if(token!==''){
                  jwt.verify(token, secret, function(err, decoded) {
                      if(err){
                          res.send({state:false,message:'登录会话已过期'})
                      }else {
                          res.send({state:true})
                      }
                  });
              }else {
                  res.status(400).send({
                      message:'请先登录'
                  })
              }
      }
    hasToken(req,res,next){
         const token=req.headers.token;
         console.log(token)
         if(token!==''){
           jwt.verify(token, secret, function(err, decoded) {
                 if(err){
                     res.send({state:false,message:'登录会话已过期'})
                 }else {
                     next();
                 }
             });
         }else {
             res.status(400).send({
                 message:'请先登录'
             })
         }
     }
    async uploadImage(req,res){
             const files= await req.files;
             let goods=[];
             files.forEach(v=>{
                 goods.push(`http://localhost:3003/GoodImg/${v.filename}`);
             });
             res.send(goods)
     }
    checkCategory(req,res){
         category.find({name:req.body.name},async function (err,docs) {
                 if(!err){
                     if(docs.length===0){
                         await  res.send(true)
                     }else {
                         await  res.send(false)
                     }
                 }
             })
     }
    async returnReserve(req,res){
        const goods=req.body;
        const model=require('../modules/goods');
        for(let i=0;i<goods.length;i++){
            const oldNum=await model.findById(goods[i].id);
            const NewReserve=oldNum.reserve+goods[i].num;
            await model.findByIdAndUpdate(goods[i].id,{reserve:NewReserve});
        }
        res.send({
            message:'回退库存成功'
        })
    }
}
module.exports=new admin();