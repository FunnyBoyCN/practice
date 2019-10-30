/**
 * Created by sun77 on 2019/7/22.
 */
const ImageController =require('../utils/image');
const fs=require('fs');
const category=require('../modules/categories');
async function deleteImg(id,isCategory) { //删除数据同时删除本地文件
    const good = require('../modules/goods');
    let result = [];
    const isIds = id.indexOf(",");
    if (isCategory) {
        result = await good.find({parentID: id});
    } else {
        if (isIds == -1) {
            result.push(await good.findById(id));
        } else {
            const ids = id.split(',');
            for (let e = 0; e < ids.length; e++) {
                result.push(await good.findById(ids[e]));
            }
        }
    }
    const imgArray=[];
    if(result.length>0){
        for(let i=0;i<result.length;i++){
            for(let j=0;j<result[i].goodsImg.length;j++){
                imgArray.push(result[i].goodsImg[j])
            }
        }
        for(let k=0;k<imgArray.length;k++){
            path='.'+imgArray[k].substring(21);
            fs.unlink(path,(err)=>{
                if(err){
                    return
                }
            })
        }
    }else {
        return false
    }
}
function setExp(time) {
    const dateNow=Date.now();
    return Exp=dateNow+60*60*24*1000*time;
};
class common{
    constructor(){
        this.getMainGoods=this.getMainGoods.bind(this);
        this.updateReserve=this.updateReserve.bind(this);
    }
    async add(req,res){
        const data=req.body;
        if(req.Model.modelName=='Good'){
            data.Exp=setExp(data.Exp).toString();
        }
        await req.Model.create(data);
        res.send('添加成功')
    } //新增数据
    async edit(req,res){
        const data=req.body;
        if(req.Model.modelName=='Good'){
            data.Exp=setExp(data.Exp).toString();
        }
        await req.Model.findByIdAndUpdate(req.params.id,data);
        res.send('修改成功')
    } //修改数据
    async deleted(req,res){
        const result= req.body.ids.toString().indexOf(",")
        if(result==-1){
            if(req.Model.modelName==='Category') {
                await deleteImg(req.body.ids, true);
                const good = require('../modules/goods');
                const finder = await good.find({parentID: req.body.ids});
                if (finder.length > 0) {
                    await good.deleteMany({parentID: req.body.ids});
                }
            }
            if(req.Model.modelName==='Good'){
                await  deleteImg(req.body.ids,false);
            }

            if(req.Model.modelName==='User'){
                const model=await req.Model.findById(req.body.ids);
                const url=model.avatar;
                if(url!=='http://localhost:3003/Avatar/default.jpg'){
                    await ImageController.deletedImage(url)
                }
                const address=require('../modules/address')
                await address.remove({userId:req.body.ids})
            }
            await req.Model.findByIdAndDelete(req.body.ids);
        }else {
            if(req.Model.modelName==='Good'){
                await  deleteImg(req.body.ids,false);
            }
            const condition=req.body.ids.split(',');
            if(req.Model.modelName==='User'){
                const address=require('../modules/address');
                await address.remove({userId:{ $in: condition }})
            }
            await req.Model.remove({ _id: { $in: condition } });
        }
        await res.send('删除成功');
    } //删除数据
    async getData(req,res){
       const result=await req.Model.find();
        res.send(result)
    }
    async getDataById(req,res){
         let result;
        if(req.Model.modelName=='Address'){
         const id=req.params.id.toString();
         result=await req.Model.find({userId:id});
        }else {
          result=await req.Model.findById(req.params.id);
        }


        res.send(result);
    }
    //聚合管道
    getMainGoods(req,res){
        const that=this;
        const isTimeTransform=req.query.isTimeTransform;
        category.aggregate([{       //聚合管道
            $lookup:{
                from:'goods',
                localField:'_id',
                foreignField:'parentID',
                as:'goodsItem'
            }
        }],function (err,docs) {
            const myDocs=docs;
            if(isTimeTransform){
                myDocs.forEach(v=>{
                    v.goodsItem.forEach(K=>{
                        K.Exp=that.timeTransform(Number(K.Exp))
                    })
                });
            }
            res.send({
                data:myDocs
            })
        })
    }
    async updateReserve(req,res){
       const model=require(`../modules/${req.body.modelName}`);
       const goods=req.body.goods;
       const response=await  this.checkReserve(model,goods);
       if(response.result){
              res.send({
                  result:response.result,
                  message:'更新库存成功'
              })
       }else {
           res.status(403).send({
               data:response.data,
               message:'商品没有足够库存'
           })
       }
    }
   timeTransform(time){
       let date = new Date(time);
       let Month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
       let Day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
       return `${date.getFullYear()}-${Month}-${Day}`;
   }
   async checkReserve(model,goods){
    //    先查找总库存
       const finders=[];//查找到的模型
       const errs=[];//没有库存的商品
       let arr=[];
       const type=(Object.prototype.toString.call(goods)).split(' ')[1].split(']')[0];
       if(type=='Object'){
           arr.push(goods)
       }else {
           arr=goods;
       }
       for (let i=0;i<arr.length;i++){
           finders.push(await model.findById(arr[i].id));
       }
       for(let i=0;i<arr.length;i++){
           for (let j=0;j<arr.length;j++){
               if(arr[j].id==finders[i]._id) {
                   if (finders[i].reserve - arr[j].num < 0) {
                       await errs.push({
                           name: finders[i].name,
                           id: finders[i]._id,
                           reserve: finders[i].reserve
                       });
                   }else {
                        await model.findByIdAndUpdate(finders[i]._id,{reserve:finders[i].reserve - arr[j].num});
                   }
               }
           }
       }
       if(errs.length>0){
           return {
                data:errs,
                result:false,
            };
       }else {
           return {
               result:true,
           };
       }

    }

}
module.exports=new common();