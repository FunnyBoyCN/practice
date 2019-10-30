/**
 * Created by sun77 on 2019/7/23.
 */
const Code=require('../modules/smsId');
const querystring = require('querystring');
const request=require('request');
const jwt = require('jsonwebtoken');
const secret = 'fruits';
const user=require('../modules/user');
const category=require('../modules/categories');
const collages=require('../modules/collage');
const goods=require('../modules/goods');
const address=require('../modules/address');
const accounts=require('../modules/accounts');
const accountRecords=require('../modules/accountRecord');
const payPasswords=require('../modules/payPassword');
const orders=require('../modules/order');
const collageOrders=require('../modules/collageOrders');
const shops=require('../modules/shop');
const memberCodes=require('../modules/memberCode');
const integrals=require('../modules/integral');
const signIns=require('../modules/signIn');
const events=require('../modules/events');
//model
const path='/../Avatar';
const customName='用户';
const ImageController=require('../utils/image');
const upload=ImageController.save(path,customName).single('avatar');
const schedule = require('node-schedule');
const clone =require('loadsh/clone');
const  cancelOrder = async (time,_id,modelName)=>{
    const model=require(`../modules/${modelName}`);
    const laterTime=new Date(time+(1000*60*15)); //15分钟后自动取消
    const timeTask=schedule.scheduleJob(laterTime,async ()=>{
        const result=await model.findById(_id);
        if(result.state!==0){
            return false
        }else {
            const cancelTime=Date.now();
            if(modelName=='collageOrders'){
                await model.findByIdAndUpdate(_id,{state:-1,cancelTime:cancelTime});
                const createdId=result.createdId;
                const userId=Number(result.userId);
                await model.updateMany({createdId:createdId},{$pull:{joinPeople: { $in: userId}}});
            }else {
                await model.findByIdAndUpdate(_id,{state:-1,payTime:cancelTime});
                let carts=result.carts;
                for(let i=0;i<carts.length;i++){
                    await goods.findById(carts[i]._id,async (err,doc)=>{
                        if(!err){
                            const reserve=doc.reserve+carts[i].num;
                            await goods.findByIdAndUpdate(carts[i]._id,{reserve});
                        }
                    })
                }
            }
        }
        });

}; //延时操作，自动取消订单
const timeTransform=(myTime)=>{
    const time=new Date(myTime);
    function num(time) {
        if(time<10){
            time=`0${time}`
        }
        return time;
    }
    return `${num(time.getFullYear())}-${num(time.getMonth()+1)}-${num(time.getDate())}  ${num(time.getHours())}:${num(time.getMinutes())}:${num(time.getSeconds())}`
};
const deletedCode=(time,_id)=>{
    let laterTime=new Date(time+(1000*60*5)); //5分钟后自动取消
    let timeTask=schedule.scheduleJob(laterTime,async ()=>{
        await Code.findByIdAndDelete(_id);
    });
}; //延时操作，自动删除失效验证码
const autoCancelOrder=async (time,createdId)=>{
    const model=await collageOrders.findById(createdId);
    let laterTime=new Date(time+(1000*60*60*24)); //24小时后未成团自动取消 退回仓库
    let timeTask=schedule.scheduleJob(laterTime,async ()=>{
            if(model.state==2||model.state==-1||model.state==0){
                return false
            }else {
                const time=Date.now();
                const joinPeople=model.joinPeople;
                const payMoney=model.price;
                joinPeople.forEach(async v=>{
                    await Refund(v,payMoney);
                });
                const parent= await collages.findById(model.parentID);
                const groups=parent.groups-1;
                const enableGroups=parent.enableGroups+1;
                await collages.findByIdAndUpdate(model.parentID,{groups:groups,enableGroups:enableGroups});
                await collageOrders.updateMany({createdId:createdId},{state:-1,cancelTime:time});
            }
     });
}; //延时操作，自动取消拼团订单
const createdOrderNum=(userId)=>{
    function num(time) {
        if(time<10){
            time=`0${time}`
        }
        return time;
    }
    const time=new Date();
    let year=time.getFullYear();
    let month=num(time.getMonth()+1);
    let day=num(time.getDate());
    let hours=num(time.getHours());
    let minutes=num(time.getMinutes());
    let seconds=num(time.getSeconds());
    let Num="";
    for(let i=0;i<3;i++)
    {
        Num+=Math.floor(Math.random()*10);
    }
    return  `${userId}${Num}${year}${month}${day}${hours}${minutes}${seconds}`;
};
const createdPickUpNum=()=>{
    let randomNum="";
    for(let i=0;i<5;i++)
    {
        randomNum+=Math.floor(Math.random()*10);
    }
    function num(time) {
        if(time<10){
            time=`0${time}`
        }
        return time;
    }
    const time=new Date();
    let year=time.getFullYear();
    let month=num(time.getMonth()+1);
    let day=num(time.getDate());
    let hours=num(time.getHours());
    let minutes=num(time.getMinutes());
    return `${randomNum.slice(0,2)}${year}${month}${day}${hours}${minutes}${randomNum.slice(2,5)}`
};
const isAllPay=async (id)=>{
    const model=await collageOrders.findById(id);  //首次创建拼团订单
    const models=await collageOrders.find({createdId:id}); //全部拼团订单
    const payArray=[];
    if(model.mode==models.length){
        models.forEach(v=>{
            if(v.state==1){
                payArray.push(v);
            }
        });
        if(payArray.length==models.length){
            let pickUpNum=createdPickUpNum();
            await collageOrders.updateMany({createdId:id},{state:2,pickUpNum});
        }
    }else {
        return false;
    }
};
const Refund=async(userId,Num)=>{
    let balance;
    let record={
        userId:userId,
        des:'退款',
        num:Num,
    };
    let userIntegral= await integrals.find({userId});
    let integral=Number(userIntegral+Math.floor(Number(-Num)));
    await integrals.findOneAndUpdate({userId},{integral});
    await accounts.find({userId},async (err,doc)=>{
        if(!err){
            const data=doc[0];
            balance=data.balance;
            balance+=Num;
            record.createdTime=Date.now();
            await accountRecords.create(record);
            await accounts.findOneAndUpdate({userId},{balance});
        }
    });
};//拼团退款
const dateCheck=(str,date)=>{
    return new Promise((resolve)=>{
        switch (str){
            case 'year':{
                let nextDate=new Date(Number(date)+(1000*60*60*24));
                let nowDate=new Date(Number(date));
                let nextYear=nextDate.getFullYear();
                let nowYear=nowDate.getFullYear();
                if(nextYear!=nowYear){
                    resolve(nextYear)
                }else {
                    resolve(nowYear)
                }
                break;
            }
            case 'month':{
                let nextDate=new Date(Number(date)+(1000*60*60*24));
                let nowDate=new Date(Number(date));
                let nextMonth=nextDate.getMonth()+1;
                let nowMonth=nowDate.getMonth()+1;
                if(nextMonth!=nowMonth){
                    resolve(nextMonth)
                }else {
                    resolve(nowMonth)
                }
                break;
            }
        }
    })
};
const updateDate =async(res,userId,date)=>{
    return new Promise(async (resolve)=>{
        let dateArray=[];
        dateArray.push(date);
        let finder=await integrals.find({userId});
        let myIntegral=Number(finder[0].integral)+5;
        await integrals.findOneAndUpdate({userId},{integral:myIntegral});
        await signIns.findOneAndUpdate({userId},{date:dateArray,accountIntegral:5});
        const result=signIns.find({userId});
        resolve(result)
    })
}
const createdMemberCode=(userId)=>{
    return new Promise((resolve)=>{
        let oRandom='';
        for(let i=0;i<4;i++){
            random=Math.floor(Math.random()*10);
            oRandom+=random;
        }
        function num(time) {
            if(time<10){
                time=`0${time}`
            }
            return time;
        }
        const time=new Date();
        let second=num(time.getSeconds());
        let month=num(time.getMonth()+1);
        let day=num(time.getDate());
        let hours=num(time.getHours());
        let minutes=num(time.getMinutes());
        resolve(`${oRandom}${month}${userId}${day}${hours}${minutes}${second}`);
    })

}
class User{
    constructor(){
        this.login=this.login.bind(this);
    }
   async sms(req,res) { //发送六位数的验证码
        let code="";
        for(let i=0;i<6;i++)
        {
           code+=Math.floor(Math.random()*10).toString();
       }
       const time = Date.now();
       const smsData = {
           code: code,
           time: time
       };
       const result = await Code.create(smsData);
       deletedCode(result.time,result._id);
       res.send({
           data:result
       })
       // var queryData = querystring.stringify({
       //     "mobile": req.body.phone,  // 接受短信的用户手机号码
       //     "tpl_id": "178962",  // 您申请的短信模板ID，根据实际情况修改
       //     "tpl_value": `#code#=${code}&#m#=5`,  // 您设置的模板变量，根据实际情况修改
       //     "key": "d8eea14857e1d1cc106c44faf8f7ee9d",  // 应用APPKEY(应用详细页查询)
       // });
       //
       // var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
       // request(queryUrl,async function (error, response, body) {
       //     if (!error && response.statusCode == 200) {
       //
       //         const result=await Code.create(smsData);
       //         res.send({
       //             data:{
       //                 data:result,
       //                 message:'发送成功'
       //             }
       //         })
       //     } else {
       //         res.send({
       //             data:{
       //                 message:'发送失败'
       //             }
       //         })
       //     }
       // })
   }
   //用户登录
   login(req,res){
       if(req.body.password) {
           user.find({phone: req.body.phone}, async (err, doc) => {
               if (err) {
                   return;
               }
               if (doc.length > 0) {
                   if(doc[0].password!=req.body.password){
                       res.status(400).send({
                           data: {
                               message:'密码不正确'
                           }
                       })
                   }else {
                       const tokenData={
                           phone:doc[0].phone,
                           userId:doc[0]._id,
                       };
                       const token=await this.createToken(tokenData,60*60*24,secret);
                       await user.findByIdAndUpdate(tokenData.userId,{token:token});
                       res.status(200).send({
                           data: {
                               userInfo: {
                                   id: doc[0]._id,
                                   phone: doc[0].phone,
                                   token: token,
                                   name: doc[0].name,
                                   avatar:doc[0].avatar,
                               },
                               message:'登录成功'
                           }
                       })
                   }

               }else {
                   res.status(400).send({
                       data: {
                           message:'用户不存在'
                       }
                   })
               }
           })
       }else {
           const nowTime=Date.now()-1000*60*5;  //验证码五分钟过期
           Code.find({code:req.body.code},async (err,doc)=>{  //查找验证码
               if(err){
                  return
               }
               if(doc.length>0){
                   if((nowTime-doc[0].time)>0){  //验证码过期删除数据库
                       await Code.findByIdAndDelete(doc[0]._id);
                       res.status(400).send({
                           data: {
                               message:'验证码已过期,请重新获取'
                           }
                       })
                   }else {
                       user.find({phone: req.body.phone},async(err,doc)=>{  //手机号查找是否存在该用户
                           if(err){
                               return
                           }
                           if(doc.length>0){
                               const tokenData={
                                   phone:doc[0].phone,
                                   userId:doc[0]._id,
                               };
                               const token=await  this.createToken(tokenData,60*60*24,secret);
                               await user.findByIdAndUpdate(tokenData.userId,{token:token});
                               res.status(200).send({
                                   data: {
                                       userInfo: {
                                           id: doc[0]._id,
                                           phone: doc[0].phone,
                                           token: token,
                                           name: doc[0].name,
                                           avatar:doc[0].avatar,
                                       },
                                       message:'登录成功'
                                   }
                               })
                           }else {
                               const defaultPassword='123';
                               const data={
                                   phone:req.body.phone,
                                   password:defaultPassword
                               };
                               const result=await  user.create(data);
                               const tokenData={
                                   phone:result.phone,
                                   userId:result._id,
                               };
                               const token=await this.createToken(tokenData,60*60*24,secret);
                               await user.findByIdAndUpdate(tokenData.userId,{token:token});
                               user.findById(tokenData.userId,async (err,doc)=>{
                                   if(err){
                                       return
                                   }
                                   res.status(200).send({
                                       data: {
                                           userInfo: {
                                               id: doc._id,
                                               phone: doc.phone,
                                               token: doc.token,
                                               name: doc.name,
                                               avatar:doc.avatar,
                                               password:doc.password,
                                           },
                                           message:'注册成功',
                                           register:true
                                       }
                                   })
                               })
                           }
                       })
                   }
               }else {
                   res.status(400).send({
                       data: {
                           message:'验证码已过期,请重新获取'
                       }
                   })
               }
           })
       }
   }
   createToken(data,timeLimit,secret){
           return  jwt.sign({
               data: data,
               exp: Math.floor(Date.now()/1000)+timeLimit
           }, secret);
   }
   async checkToken(req,res,next){
       const token=req.headers.token;
        if(token){
            jwt.verify(token, secret,async function(err, decoded) {
                if(err){
                    res.status(401).send({
                        data:{
                            message:'登录会话已过期,请先登录',
                            logout:true
                        }
                    })
                }else {
                     next();
                }
            });
        }else {
            res.status(401).send({
                data:{
                    message:'请先登录',
                    logout:true
                }
            })
        }
   }
   async CheckToken(req,res){
        const token=req.headers.token;
        jwt.verify(token, secret,async function(err, decoded) {
            if(err){
                res.status(403).send({
                    data:{
                        message:'登录会话已过期,请先登录',
                    }
                })
            }else {
                res.status(200).send({});
            }
        });
    }
   async editPassword(req,res){
       let form=req.body.form;
       let token=req.headers.token;
       let userId=jwt.decode(token).data.userId;
       let userInfo=await user.findById(userId);
       if(userInfo.password!=form.oldPassword){
           res.status(401).send({
               data:{
                   message:'原密码错误'
               }
           })
       }else {
           await user.findByIdAndUpdate(userId,{password:form.password});
           res.status(200).send({
               data:{
                   message:'修改成功'
               }
           })
       }
    }
   //头像
    uploadAvatar(req,res){
        upload(req, res,async function () {
            const file=req.file;
            const token=req.headers.token;
            const decoded=jwt.decode(token);
            const defaultAvatar=(await user.findById(decoded.data.userId)).avatar;
            if(defaultAvatar!=='http://47.107.134.55:4004/Avatar/default.jpg'){
                await ImageController.deletedImage(defaultAvatar);
            }
            const url=await `http://192.168.3.2:3003/Avatar/${file.filename}`;
            const result=await user.findByIdAndUpdate(decoded.data.userId,{avatar:url},{new:true});
            res.send(result)
        })
    }
    async userInfoDetail(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const result=await user.findById(userId);
        res.status(200).send({
            data:{
                result:{
                    name:result.name,
                    avatar:result.avatar,
                    phone:result.phone,
                    id:result._id
                }
            }
        })
    }
    async getAvatar(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const id=req.query.id;
        let result={};
        if(id){
            result=await user.findById(id);
        }else {
            result=await user.findById(userId);
        }
        const avatar=result.avatar;
        res.status(200).send({
            data:avatar
        })
    }
    async getCollage(req,res){
        const id=req.query.id;
        let result;
        if(id){
            result=await collages.findById(id);
        }else {
          result=await collages.find();
        }
        res.send({
            data:result
        })
    }
    async getGoodsDetail(req,res){
        const id=req.query.id;
        const result=await goods.findById(id);
        if(result==[]){
            res.status(404).send({
                data:{
                    message:'商品不存在'
                }
            })
        }else {
            res.send({
                data:{
                    goodsContent:result
                }
            })
        }
    }
    // 用户地址
    async editAddress(req,res){
        const data=req.body;
        const isDefault=data.isDefault;
        if(data.id){
            if(isDefault){
             await address.updateMany({isDefault:true},{isDefault:false});
            }
            await address.findByIdAndUpdate(data.id,data);
            res.status(200).send({
                data:{
                    message:'修改成功'
                }
            })

        }else {
            if(isDefault){
                await address.updateMany({isDefault:true},{isDefault:false});
            }
            await address.create(data);
            res.status(200).send({
                    data:{
                        message:'添加成功'
                    }
                })
        }
    }
    async address(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const result=await address.find({userId:userId});
        res.send({
            data:{
                result:result,
            }
        })
    }
    async addressById(req,res){
        const id=req.query.id;
        const result=await address.findById(id);
        res.send({
            data:{
                result:result,
            }
        })
    }
    async deletedAddress(req,res){
        const id=req.body.id;
        await address.findByIdAndDelete(id);
        res.status(200).send({
            data:{
                message:'删除成功'
            }
        })
    }
    async userInfo(req,res){
        const token=req.headers.token;
        const decoded=jwt.decode(token);
        const userInfo=decoded.data;
        res.send({
            data:{
                result:userInfo,
            }
        })
    }
    async isDefault(req,res){
        const id=req.body.id;
        await address.updateMany({isDefault:true},{isDefault:false});
        await address.findByIdAndUpdate(id,{isDefault:true})
        res.send({
            data:{
                message:'设置成功'
            }
        })
    }
    //用户账户
    async accounts(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        accounts.find({userId:userId},async (err,doc)=>{
            if(err){
               res.status(400).send({
                   data:{
                       message:'未找到资源'
                   }
               })
            }
            if(doc.length==0){
                const record={
                    createdTime:Date.now(),
                    userId,
                    des:'创建账户'
                };
                const data={
                    userId,
                    balance:0
                };
               const result=await accounts.create(data);
               await accountRecords.create(record);
                res.status(200).send({
                    data:{
                        result:result
                    }
                })
            }else {
                res.status(200).send({
                    data:{
                        result:doc[0]
                    }
                })
            }
        });
    }
    async editAccounts(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const desc=req.body.desc;
        const oldBalance=req.body.balance;
        let balance;
        const record={
            userId,
            des:desc,
            num:oldBalance,
        };
        await accounts.find({userId},async (err,doc)=>{
            if(!err){
                const data=doc[0];
                 balance=data.balance;
            }
        });
        balance+=oldBalance;
        balance=balance.toFixed(2);
        record.createdTime=Date.now();
        await accountRecords.create(record);
        await accounts.findOneAndUpdate({userId},{balance});
        res.send({
            data:{
                message:`${desc}成功`
            }
        })
    }
    async accountRecords(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const result=await accountRecords.find({userId});
        res.send({
            data:{
                result
            }
        })
    }
    // 用户支付密码
    async payPassword(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        payPasswords.find({userId:userId},async (err,doc)=>{
              if(err){
                  return false;
              }
              if(doc.length==0){
                  res.status(404).send({
                      data:{
                          message:'还未创建支付密码'
                      }
                  })
              }else {
                  res.send({
                      data:{
                          result:doc[0]
                      }
                  })
              }
         })
    }
    async createPayPassword(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const data={
            userId,
            password:req.body.password,
        };
        payPasswords.find({userId},async (err,doc)=>{
            if(!err){
                if(doc.length>0){
                    res.status(400).send({
                        data:{
                            message:'支付密码已创建'
                        }
                    })
                }else {
                    await payPasswords.create(data);
                    res.send({
                        data:{
                            message:'创建支付密码成功'
                        }
                    })
                }
            }
        })

    }
    async checkPayPassword(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const password=req.body.password;
        payPasswords.find({userId},async(err,doc)=>{
            if(err){
                return false;
            }
            if(doc.length==0){
                res.status(404).send({
                    data:{
                        message:'还未创建支付密码'
                    }
                })
            }else {
                if(password==doc[0].password){
                    res.status(200).send({
                        data:{
                            message:'通过验证'
                        }
                    })
                }else {
                    res.status(400).send({
                        data:{
                            message:'您输入的密码有误'
                        }
                    })
                }
            }
        })
    }
    async editPayPassword(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        payPasswords.find({userId:userId},async (err,doc)=>{
            if(err){
                return false;
            }
            if(doc.length==0){
                res.status(404).send({
                    data:{
                        message:'还未创建支付密码'
                    }
                })
            }else {
                const newPassword=req.body.password;
                await payPasswords.findOneAndUpdate({userId:userId},{password:newPassword});
                res.send({
                    data:{
                        message:'修改支付密码成功'
                    }
                })
            }
        })
    }
    //结算
    async checkReserve(req,res){
        const carts=req.body.merchandise;
        const errCart=[];
        for(let i=0;i<carts.length;i++){
           await goods.findById(carts[i]._id,async (err,doc)=>{
                if(!err){
                    if(doc=={}){
                        res.status(404).send({
                            data:{
                                message:'无此商品'
                            }
                        })
                    }else {
                       const reserve=doc.reserve-carts[i].num;
                       if(reserve<0){
                           errCart.push({
                               doc,
                               yourNum:carts[i].num
                           });
                       }
                    }
                }
            })
        }
        if(errCart.length==0){
            res.status(200).send({
                data:{
                    message:'库存可购'
                }
            });
        }else {
            res.status(403).send({
                data:{
                    message:'此商品库存不足',
                    result:{
                        errCart,
                    }
                }
            })
        }
    }
    async createdOrder(req,res){
        const Data=req.body;
        const id=req.body.id;
        const payPrice=req.body.price;
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        if(id){
            const payTime=Date.now();
            const orderNum=createdOrderNum(userId);
            await orders.findById(id,async (err,doc)=>{
                if(!err) {
                    if (doc.state !== 0) { //订单状态不是待支付状态 支付失败
                        res.status(403).send({
                            data: {
                                message: '支付失败'
                            }
                        });
                        return false;
                    } else {
                        let balance;
                        const record = {
                            userId,
                            des: `${orderNum}商品支付`,
                            num: -payPrice,
                        };
                        let userIntegral= await integrals.find({userId});
                        let integral=Number(userIntegral+Math.floor(Number(payPrice)));
                        await integrals.findOneAndUpdate({userId},{integral});
                        await accounts.find({userId}, async (err, doc) => {  //查询用户账户
                            if (!err) {
                                const data = doc[0];
                                balance = data.balance;
                            }
                        });
                        balance -= payPrice; //查询支付后价格
                        balance = balance.toFixed(2);
                        if (balance < 0) {  //余额小于零 支付失败
                            res.status(403).send({
                                data: {
                                    message: '支付失败'
                                }
                            });
                            return false;
                        }else {
                            //更新账户记录 更新账户余额
                            record.createdTime =payTime;
                            await accountRecords.create(record);
                            await accounts.findOneAndUpdate({userId}, {balance});
                            //支付完成 后更新订单状态 订单号 支付时间
                            await orders.findByIdAndUpdate(id,{state:1,orderNum,payTime},async (err,myDoc)=> {
                                if (!err) {
                                    res.status(200).send({
                                        data: {
                                            message: '支付成功'
                                        }
                                    })
                                }
                            });
                        }
                    }
                }
            });
        }else {
            const data={
                carts:Data.carts,
                address:Data.address,
                userId:userId,
                totalNum:Data.totalNum,
                totalPrice:Data.totalPrice,
            };
            data.createdTime=Date.now();
            const carts=data.carts;
            for(let i=0;i<carts.length;i++){
                await goods.findById(carts[i]._id,async (err,doc)=>{
                    if(!err){
                        if(doc=={}){
                            res.status(404).send({
                                data:{
                                    message:'无此商品'
                                }
                            })
                        }else {
                            const reserve=doc.reserve-carts[i].num;
                            await goods.findByIdAndUpdate(carts[i]._id,{reserve});
                        }
                    }
                })
            }
            const model=await orders.create(data);
            cancelOrder(data.createdTime,model._id,'order');
            res.send({
                data:{
                    message:'创建初始订单成功',
                    id:model._id,
                }
            })
        }

    }
    async cancelNormalOrder(req,res){
       const id=req.body.id;
       await orders.findById(id,async (err,doc)=>{
           if(err){
               res.status(404).send({
                   data:{
                       message:'无效订单'
                   }
               })
           }
           if(doc.state!==0){
               res.status(400).send({
                   data:{
                       message:'无效请求'
                   }
               })
           }else {
               const cancelTime=Date.now();
               await orders.findByIdAndUpdate(id,{state:-1,payTime:cancelTime});
               let carts=doc.carts;
               for(let i=0;i<carts.length;i++){
                   await goods.findById(carts[i]._id,async (err,doc)=>{
                       if(!err){
                         const reserve=doc.reserve+carts[i].num;
                          await goods.findByIdAndUpdate(carts[i]._id,{reserve});
                       }
                   })
               }
               await res.status(200).send({
                   data:{
                       message:'已取消订单'
                   }
               })
           }
       })
    }
    //订单
    async order(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const id=req.query.id;
        let myData;
        if(id){
            let data=await orders.findById(id);
            myData=JSON.parse(JSON.stringify(data));
            myData.createdTime=timeTransform(myData.createdTime);
            if(myData.payTime!==0){
                myData.payTime=timeTransform(myData.payTime);
            }
        }else {
            let data=await orders.find({userId});
             myData=JSON.parse(JSON.stringify(data));
            for(let i=0;i<myData.length;i++){
                myData[i].createdTime=timeTransform(myData[i].createdTime);
                if(myData[i].payTime!==0){
                    myData[i].payTime=timeTransform( myData[i].payTime);
                }
            }
        }
        res.status(200).send({
            data:myData,
        })
    }
    //拼团
    async defaultCollageOrder(req,res) {
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const data=req.body.data;
        const parentID=data.parentID;
        const id=req.body.id;
        if(id){
            const model=await collageOrders.findById(id);
            if(model.state==2){
                res.status(400).send({
                    data:{
                        message:'此团已结束，请参与其他拼团',
                    }
                });
                return false;
            }
            if(model.state==-1||model.state==0){
                res.status(404).send({
                    data:{
                        message:'此拼团无效，请重新开团，或参与其他拼团',
                    }
                });
                return false;
            }
            if(model.joinPeople.length==model.mode){
                res.status(400).send({
                    data:{
                        message:'拼团人数已达上限，请参与其他拼团抢购',
                    }
                })
            }else {
                const has=model.joinPeople.indexOf(userId);
                if(has!==-1){
                    res.status(400).send({
                        data:{
                            message:'您已经参与该拼团,请勿重复提交',
                        }
                    });
                    return false;
                }else {
                    data.createdTime=Date.now();
                    const Model=await collageOrders.findById(id);
                    data.joinPeople=Model.joinPeople;
                    data.createdId=Model.createdId;
                    data.userId=userId;
                    const model=await collageOrders.create(data);
                    await cancelOrder(data.createdTime,model._id,'collageOrders');
                    res.send({
                        data:{
                            message:'创建拼团订单成功，请尽快支付',
                            _id:model._id
                        }
                    })
                }
            }
        }else {
            const collageOrder=await collageOrders.find({parentID,userId});
            if(collageOrder.length!==[]){
                let notAllow=false;
                collageOrder.forEach(v=>{
                    if(v.state>=1){
                          notAllow=true;
                    }
                });
                if(notAllow){
                    res.status(403).send({
                        data:{
                            message:'只能参团一次'
                        }
                    })
                }else{
                    data.createdTime=Date.now();
                    data.joinPeople=[];
                    data.userId=userId;
                    const result=await collageOrders.create(data);
                    const _id=result._id;
                    await collageOrders.findByIdAndUpdate(_id,{createdId:_id});
                    await cancelOrder(data.createdTime,_id,'collageOrders');
                    res.send({
                        data:{
                            message:'创建拼团订单成功，请尽快支付',
                            _id
                        }
                    })
                }
            }
        }

    }
    async createdCollageOrder(req,res){
        const id=req.body.id;
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        const checkModel=await collageOrders.findById(id);
        const payPrice=req.body.price;
        const orderNum=createdOrderNum(userId);
        const payTime=Date.now();
        if(checkModel.userId!==userId.toString()||checkModel.state!==0){
            res.status(403).send({
                data:{
                    message:'无效操作'
                }
            });
            return false;
        }else {
            let balance;
            const record = {
                userId,
                des: `${orderNum}拼团商品支付`,
                num: -payPrice,
            };
            let userIntegral= await integrals.find({userId});
            let integral=Number(userIntegral+Math.floor(Number(payPrice)));
            await integrals.findOneAndUpdate({userId},{integral});
            await accounts.find({userId}, async (err, doc) => {  //查询用户账户
                if (!err) {
                    const data = doc[0];
                    balance = data.balance;
                }
            });
            balance -= payPrice; //查询支付后价格
            balance = balance.toFixed(2);
            if (balance < 0) {  //余额小于零 支付失败
                res.status(403).send({
                    data: {
                        message: '支付失败'
                    }
                });
                return false;
            }else {
                //更新账户记录 更新账户余额
                record.createdTime =payTime;
                await accountRecords.create(record);
                await accounts.findOneAndUpdate({userId}, {balance});
                //支付完成 后更新订单状态 订单号 支付时间  更新拼团商品库存
                if(id==checkModel.createdId){    //拼团发起者支付 开启拼团订单
                    await collageOrders.findByIdAndUpdate(id,{orderNum:orderNum,state:1,createdPayTime:payTime});
                    await collageOrders.findByIdAndUpdate(id,{$push:{joinPeople:userId}});
                    const parent= await collages.findById(checkModel.parentID);
                    const groups=parent.groups+1;
                    const enableGroups=parent.enableGroups-1;
                    await collages.findByIdAndUpdate(checkModel.parentID,{groups:groups,enableGroups:enableGroups});
                    autoCancelOrder(payTime,checkModel.createdId);
                }else {  //参团者
                    await collageOrders.findByIdAndUpdate(id,{orderNum:orderNum,state:1,createdPayTime:checkModel.createdPayTime});
                    await collageOrders.updateMany({createdId:checkModel.createdId},{$push:{joinPeople:userId}});
                }
                await isAllPay(checkModel.createdId);
                res.send({
                    data:{
                        message:'支付成功'
                    }
                })
            }
        }
    }
    async getCollageOrder(req,res){ //获取拼团
       const token=req.headers.token;
       const userId=jwt.decode(token).data.userId;
       const id=req.query.id;
       if(id) {
          collageOrders.findById(id,(err,doc)=>{
              if(!err){
                if(doc){
                    const myData=JSON.parse(JSON.stringify(doc));
                    myData.createdTime=timeTransform(myData.createdTime);
                    if(myData.cancelTime!==0){
                        myData.cancelTime=timeTransform(myData.cancelTime);
                    }
                    res.status(200).send({
                        data:myData
                    })
                }else {
                    res.status(404).send({
                       data:{
                           message:'没有订单消息'
                       }
                    })
                }
              }
          });
       }else {
           collageOrders.find({userId:userId},(err,docs)=>{
               if(!err){
                   if(docs){
                       const myData=JSON.parse(JSON.stringify(docs));
                       for(let i=0;i<myData.length;i++){
                           myData.createdTime=timeTransform(myData.createdTime);
                           if(myData[i].cancelTime!==0){
                               myData[i].cancelTime=timeTransform(myData[i].cancelTime);
                           }
                       }
                       res.status(200).send({
                           data:myData
                       })
                   }else {
                       res.status(404).send({
                           data:{
                               message:'没有订单消息'
                           }
                       })
                   }
               }
           });
       }
    }
    async getNotGroupsOrder(req,res){ //获取未成团拼团
        const parentID=req.query.id; //是否拼团商品内展示
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        let myData;
        if(parentID){
            collageOrders.find(parentID,(err,docs)=>{
                if(!err){
                    if(docs){
                        myData=JSON.parse(JSON.stringify(docs));
                        myData=myData.filter(item=>{
                            return item.state!==2;
                        });
                        res.status(200).send({
                            data:myData
                        })
                    }else {
                        res.status(404).send({
                            data:{
                                message:'没有订单消息'
                            }
                        })
                    }
                }
            });
        }else {
            //不传拼团商品id 则在推荐列表中显示 获取用户token 过滤用户已经拼团过并且付款的商品
            const result=await collageOrders.find({userId});
            let userJoinGroup=[];
            result.forEach(v=>{
                if(v.state>=1){
                    userJoinGroup.push(v)
                }
            });
            // const diff=(arr1,arr2)=>{
            //     let a = [];
            //     let b = [];
            //
            //     for(let i=0;i<arr2.length;i++){
            //         a[arr2[i].parentID]=true;
            //     }
            //     for(let i=0;i<arr1.length;i++){
            //         if(!a[arr1[i].parentID]){
            //             b.push(arr1[i]);
            //         }
            //     }
            //     return b;
            // };
            collageOrders.find((err,docs)=>{
                if(!err){
                    if(docs){
                        // const result=diff(docs,userJoinGroup);
                        let allOrder=docs;
                        let  result=[];
                        let obj={};
                        for(let i of allOrder){
                            if(!obj[i.parentID]){
                                result.push(i);
                                obj[i.parentID]=1;
                            }
                        }
                        let userNotJoinGroups=[];
                        result.forEach(v=>{
                            if(v.joinPeople.indexOf(userId)==-1){
                                userNotJoinGroups.push(v)
                            }
                        });
                        res.status(200).send({
                            data:userNotJoinGroups
                        })
                    }else {
                        res.status(404).send({
                            data:{
                                message:'没有订单消息'
                            }
                        })
                    }
                }
            });
        }
    }
    async checkCollageReserve(req,res){
        const id=req.body.id;
        const result=await collages.findById(id);
        const endTime=new Date((result.timeLimit[1]).replace(/-/g,'/')).getTime()+(60*60*1000*24);
        const isOverdue=Date.now()-endTime>0?true:false;
        if(isOverdue){
            res.status(403).send({
                data:{
                    message:'此拼团商品已过期'
                }
            });
            return  false;
        }
        if(result.enableGroups==0){
            res.status(404).send({
                data:{
                    message:'此商品暂无库存'
                }
            })
        }else {
            res.status(200).send({
                data:{
                    message:'库存可购'
                }
            });
        }
    }
    async cancelCollageOrder(req,res){
        const _id=req.body.id;
        const cancelTime=Date.now();
        const result=await collageOrders.findById(_id);
        const createdId=result.createdId;
        const payMoney=result.price;
        const joinPeople=result.joinPeople;
        if(result.state==-1){
            res.status(403).send({
                data:{
                    message:'无效操作'
                }
            });
            return false
        }
        if(_id==createdId){//拼团发起者取消订单 则全部取消订单 并且退款
            if(result.state!==0){
                joinPeople.forEach(async v=>{
                    await Refund(v,payMoney);
                });
            }

            await collageOrders.updateMany({createdId:createdId},{state:-1,cancelTime:cancelTime,joinPeople:[],pickUpNum:0});
            res.status(200).send({
                data:{
                    message:'取消订单成功，欢迎下次订购'
                }
            })
        }else {           //拼团者取消订单 根据状态判断是否退款 根据之前的
            if(result.state==1){
                const userId=Number(result.userId);
                await Refund(userId,payMoney);
                await collageOrders.updateMany({createdId:createdId},{$pull:{joinPeople: { $in: userId}}});
                await collageOrders.findByIdAndUpdate(_id,{state:-1,cancelTime:cancelTime});
            }else if(result.state==2){
                const payTime=result.createdPayTime;
                const time=Date.now()-payTime;
                if(time>(1000*60*60*24)){  //超出期限再退款 已成团产品取消
                    joinPeople.forEach(async v=>{
                        await Refund(v,payMoney);
                    });
                    await collageOrders.updateMany({createdId:createdId},{state:-1,cancelTime:cancelTime,pickUpNum:0,joinPeople:[]});
                }else {     //拼团期限内退款 拼团继续存在 只产生退款、取消个人订单操作
                    const userId=Number(result.userId);
                    await Refund(userId,payMoney);
                    await collageOrders.updateMany({createdId:createdId},{$pull:{joinPeople: { $in: userId}}});
                    await collageOrders.findByIdAndUpdate(_id,{state:-1,cancelTime:cancelTime});
                }
            }
            res.status(200).send({
                data:{
                    message:'取消订单成功，欢迎下次订购'
                }
            })
        }

    }
    async getShop(req,res){
        const id=req.query.id;
        let result;
        if(id){
            try{
               result=await shops.findById(id);
               res.status(200).send({
                   data:{
                       result
                   }
               })
            }catch (err){
                res.status(404).send({
                    data:{
                        message:err
                    }
                })
            }
        }else {
            try{
                result=await shops.find();
                res.status(200).send({
                    data:{
                        result
                    }
                })
            }catch (err){
                res.status(404).send({
                    data:{
                        message:err
                    }
                })
            }
        }

    }
    async createdShop(req,res){
        const data=req.body;
        let result;
        result=await shops.create(data);
        res.status(200).send({
            data:{
                result
            }
        })
    }
    //会员码
    memberCode(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        memberCodes.find({userId},(err,docs)=>{
            if(!err){
                if(docs.length==0){
                    createdMemberCode(userId).then(res=>{
                        const data={
                            userId,
                            codeNum:res
                        }
                        return memberCodes.create(data);
                    }).then(response=>{
                        res.send({
                            data:{
                                result:response.codeNum
                            }
                        })
                    })
                }else {
                    createdMemberCode(userId).then(res=>{
                        return  memberCodes.findOneAndUpdate({userId},{codeNum:res})
                    }).then(response=>{
                        res.send({
                            data:{
                                result: response.codeNum
                            }
                        })
                    })
                }

            }
        })
    }
    // 积分
    integral(req,res){
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        integrals.find({userId},async (err,docs)=>{
            if(!err){
                if(docs.length==0){
                    const data={
                        userId
                    };
                  let result=await integrals.create(data);
                    res.send({
                        data:{
                            result
                        }
                    })
                }else {
                    res.send({
                        data:{
                            result:docs[0]
                        }
                    })
                }
            }
        })
    }
    // 搜索
    async search(req,res){
        let str=req.body.str;
        let search=new RegExp(str);
        let promiseA=async function() {
           return  goods.find({name:search});
        };
        let promiseB=async function() {
            return  collages.find({'goodsContent.name':search});
        };
        let [resultA,result]=await  Promise.all([promiseA(),promiseB()]);
        let resultB=JSON.parse(JSON.stringify(result));
        for(let i=0;i<resultB.length;i++){
            resultB[i].name='collage'
        }
        res.send({
            data:{
                result:resultA.concat(resultB)
            }
        })
    }
    async signIn(req,res){
        const date=req.body.date;
        const token=req.headers.token;
        const userId=jwt.decode(token).data.userId;
        if(date){
            let docs=await signIns.find({userId});
            if(docs.length==0){
                let dateArray=[];
                dateArray.push(date);
                let finder=await integrals.find({userId});
                let myIntegral=Number(finder[0].integral)+5;
                await integrals.findOneAndUpdate({userId},{integral:myIntegral});
                const result=await signIns.create({userId,date:dateArray,accountIntegral:5});
                res.send({
                    data:{
                        result,
                        message:'签到成功'
                    }
                })
            }else {
                let dateArray=docs[0].date;  //旧日期数组
                let lastDateNumber=Number(dateArray[dateArray.length-1]); //旧日期数组最后一项时间戳
                const lastDate=new Date(Number(dateArray[dateArray.length-1]));//旧日期数组最后一项时间

                const lastDay=lastDate.getDate();//旧日期数组最后一项天

                let nowDate=new Date(Number(date));     //新日期时间戳

                const nowYear=nowDate.getFullYear(); //新日期时间年份
                const nowMonth=nowDate.getMonth()+1; //新日期时间月份
                const nowDay=nowDate.getDate(); //新日期时间天
                //首先判断旧日期最后一项的时间戳年份加一是否等于之前的年份 等于返回之前的年份做判断 不等于返回之后的年份
                Promise.all([dateCheck('year',lastDateNumber),dateCheck('month',lastDateNumber)]).then(async result=>{
                    let lastYear=result[0];
                    let lastMonth=result[1];
                    if(lastYear!=nowYear||lastMonth!=nowMonth){
                        return updateDate(res,userId,date);
                    }else if(nowDay-lastDay==0){
                        return  Promise.reject({message:'您今天已经签到'})
                    }else if(nowDay-lastDay>1||dateArray.length==7){
                        return updateDate(res,userId,date);
                    }else {
                        let dateArrayLength=(dateArray.length);
                        let integralArray=[];
                        let start=5;
                        integralArray.push(start);
                        for(let i=1;i<7;i++){
                            start=start+1;
                            integralArray.push(start)
                        }
                        //签到
                        let finder=await signIns.find({userId});
                        let oldIntegral=finder[0].accountIntegral;
                        let integral=integralArray[dateArrayLength]+oldIntegral;
                        //增加用户积分
                        let integralFinder=await integrals.find({userId});
                        let myIntegral=Number(integralFinder[0].integral)+Number(integralArray[dateArrayLength]);
                        let oldDate=finder[0].date;
                        oldDate.push(date);
                        await integrals.findOneAndUpdate({userId},{integral:myIntegral});
                        await signIns.findOneAndUpdate({userId},{date:oldDate,accountIntegral:integral});
                        return await signIns.find({userId});
                    }
                }).then(result=>{
                    res.send({
                        data:{
                            result:result,
                            message:'签到成功'
                        }
                    });
                }).catch(err=>{
                    res.status(401).send({
                        data:{
                            message:err.message
                        }
                    });
                })
            }
        }else {
           let docs=await signIns.find({userId});
           res.send({
               data:{
                   result:docs[0]
               }
           })
        }
    }
    // 活动
    async events(req,res){
        const id=req.query.id;
        if(id){
            let finder=await events.findById(id);
            res.send({
                data:{
                    result:finder
                }
            })
        }else {
            let finder=await events.find();
            res.send({
                data:{
                    result:finder
                }
            })
        }

    }
}
module.exports=new User();