/**
 * Created by sun77 on 2019/7/15.
 */
const User=require('../../controller/user');
const Common=require('../../controller/common');
module.exports=(app)=>{
    const express=require('express');
    const router=express.Router();
    const user=require('../../modules/user');
    const goods=require('../../modules/goods');
    const timeTransform=require('../../utils/user/timeTransform.js');
    async function checkReserve(arr,res) {
        const finders=[];//查找到的模型
        const errs=[];//没有库存的商品
        for (let i=0;i<arr.length;i++){
            finders.push(await goods.findById(arr[i].id));
        }
        for(let i=0;i<arr.length;i++){
            for (let j=0;j<arr.length;j++){
                if(arr[j].id==finders[i]._id){
                    if(finders[i].totalNum-arr[j].num<0){
                       await errs.push({
                            name:finders[i].name,
                            id:finders[i]._id,
                            totalNum:finders[i].totalNum
                        });
                    }
                }
            }
        }
        if(errs.length>0){
            await res.status(400).send({
                data:errs,
                message:'以下商品没有足够的数量购买'
            });
        }else {
            return true
        }

    } //检查库存
    // 用户登陆操作
    router.post('/sms',User.sms);//发送验证码
    router.post('/login',User.login); //每次登录都更新token
    router.post('/checkToken',User.CheckToken);  //打开页面的时候检查token是否过期
    router.post('/editPassword',User.checkToken,User.editPassword); //用户修改登录密码
    // 商品渲染
    router.get('/mainGoods',Common.getMainGoods);  //获取主页面商品
    router.get('/collages',User.getCollage); //获取拼团商品
    router.get('/goodsDetail',User.getGoodsDetail);//获取商品详情

  // 用户信息获取
    router.get('/userInfo',User.checkToken,User.userInfo); //用户信息接口
    router.get('/userInfoDetail',User.checkToken,User.userInfoDetail);
    // 地址
    router.get('/address',User.checkToken,User.address);//用户地址接口
    router.get('/addressById',User.checkToken,User.addressById);//用户具体某条地址接口
    router.post('/deletedAddress',User.checkToken,User.deletedAddress);//删除用户某条地址接口
    router.post('/isDefault',User.checkToken,User.isDefault);//修改用户默认地址接口
    router.post('/editAddress',User.checkToken,User.editAddress);//更新或添加用户地址数据
    // 账户
    router.get('/accounts',User.checkToken,User.accounts);//用户账户接口
    router.get('/accountRecords',User.checkToken,User.accountRecords);//用户账户详情接口
    router.post('/editAccounts',User.checkToken,User.editAccounts);//用户账户修改接口
    // 头像
    router.get('/avatar',User.checkToken,User.getAvatar);
    router.post('/avatar',User.checkToken,User.uploadAvatar);  //修改用户头像
    // 支付密码
    router.get('/payPassword',User.checkToken,User.payPassword);
    router.post('/createPayPassword',User.checkToken,User.createPayPassword);
    router.post('/editPayPassword',User.checkToken,User.editPayPassword);
    router.post('/checkPayPassword',User.checkToken,User.checkPayPassword);
   // 结算接口
    router.post('/checkReserve',User.checkToken,User.checkReserve);
    router.post('/createdOrder',User.checkToken,User.createdOrder);
    router.post('/cancelOrder',User.checkToken,User.cancelNormalOrder);
    //订单
    router.get('/order',User.checkToken,User.order);
    //拼团订单
    router.post('/checkCollageReserve',User.checkToken,User.checkCollageReserve); //检查库存 传入ID 当拼团createdId==_id 是否超过活动期限
    router.post('/createCollageOrder',User.checkToken,User.defaultCollageOrder);//初始化订单
    router.post('/createdCollageOrder',User.checkToken,User.createdCollageOrder);//创建订单
    router.post('/cancelCollageOrder',User.checkToken,User.cancelCollageOrder);
    router.get('/getCollageOrder',User.checkToken,User.getCollageOrder);//获取订单
    router.get('/getNotGroupsOrder',User.getNotGroupsOrder);//获取未成团订单 根据是否传入parentId在商品详情中展示
    router.post('/paynotify',async (req,res)=>{
        let noticeData = req.body;
        console.log(noticeData)
    });
    //获取商店信息
    router.get('/Shop',User.getShop);
    router.post('/createdShop',User.createdShop);
    // 会员码
    router.get('/memberCode',User.checkToken,User.memberCode);
    // 积分
    router.get('/integral',User.checkToken,User.integral);
    //搜索
    router.post('/search',User.search);
    //签到
    router.post('/signIn',User.checkToken,User.signIn);
    router.get('/signIn',User.checkToken,User.signIn);
    // 活动页面
    router.get('/events',User.events);
    app.use('/user/api',router);
}