/**
 * Created by sun77 on 2019/7/12.
 */
const common =require('../../controller/common');
const admin=require('../../controller/admin');
const ImageController=require('../../utils/image');
const upload=ImageController.save('/../GoodImg','fruits');
module.exports=(app)=>{
    const express=require('express');
    const router=express.Router({
        mergeParams:true
    });
    //通用cued接口
    router.post('/',admin.hasToken, common.add);//新增数据
    router.put('/:id',admin.hasToken,common.edit); //修改数据
    router.get('/',admin.hasToken,common.getData);//获取数据
    router.get('/:id',admin.hasToken,common.getDataById);//获取数据
    router.post('/delete',admin.hasToken,common.deleted); //删除数据
    app.use("/admin/api/rest/:resource",async (req,res,next)=>{
        const modelName=req.params.resource;
        req.Model=require(`../../modules/${modelName}`)
        next();
    },router);
    // admin/api 接口
    app.post('/admin/api/login',admin.login);  //管理员登录
    app.post('/admin/api/checkToken',admin.loginCheckToken); //检查token
    app.post('/admin/api/uploads',admin.hasToken,upload.array('goods',8),admin.uploadImage); //上传图片
    app.post('/admin/api/checkCategory',admin.hasToken,admin.checkCategory);
    app.post('/admin/api/getMainGoods',common.getMainGoods);
    app.post('/admin/api/updateReserve',common.updateReserve);
    app.post('/admin/api/returnReserve',admin.returnReserve);
}