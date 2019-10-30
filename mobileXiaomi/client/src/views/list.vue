<template>
    <div class="font">
        <div class="fixed">
            <van-image src="https://i8.mifile.cn/b2c-mimall-media/7e6f1f652ccc78e3bf84c2e85585a6f4.png?w=1080&h=300&bg=E8EDF1"></van-image>
            <ul class="chooseCtrl">
                <li v-for="(val,index) in chooseItem" class="item"  @click="choose(index,val)">
                    <div :class="chooseFlag==index?'selected':''">{{val.text}}</div>
                    <div v-show="val.isShowIcon"  class="marginLeftFont flex column">
                     <van-icon  name="arrow-up" :color="val.toTop&&chooseFlag==index?'#ff6700':''" size="0.5rem"></van-icon>
                     <van-icon  name="arrow-down" :color="!val.toTop&&chooseFlag==index?'#ff6700':''" size="0.5rem"></van-icon>
                    </div>
                </li>
            </ul>
        </div>
        <div class="paddingTopShow">
            <template v-for="(val,index) in searchResultShop" v-model="searchResultShop">
                <div class="shopContent bgwhite">
                    <template v-for="(v,k) in val.options">
                        <div class="shopItem flex row padding border" @click="toShop(val.pid)">
                            <van-image width="120" height="120" :src="val.img"></van-image>
                            <div class="flex column justCenter">
                                <div class="name">{{val.name}} {{v.prop1_value}}</div>
                                <div class="dec marginFontTop">潮流镜面渐变色，2400万自拍旗舰</div>
                                <div class="flex row marginFontTop alignCenter">
                                    <div class="realPrice">￥{{v.price}}</div>
                                    <del class="price marginLeftFont">￥{{val.market_price}}</del>
                                </div>
                                <div class="marginFontTop">评论数：{{val.commentLength}}条</div>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {myApi} from '../utils/myApi'
    import {api} from '../utils/api'
    import {Image,Icon} from 'vant'
    import 'vant/lib/image/style'
    import 'vant/lib/icon/style'
    Vue.use(Image).use(Icon);
     export default{
         data(){
             return{
                 chooseFlag:0,
                 name:'',
                 searchResultShop:[],
                 shopComment:[],
                  chooseItem:[{
                      text:'综合',
                      isShowIcon:false,
                      condition:'',
                  },{
                      text:'价格',
                      toTop:false,
                      isShowIcon:true,
                      condition:'market_price',
                      isNex:true,
                      nextCondition:'price'
                  }, {
                      text:'评价',
                      toTop:false,
                      isShowIcon:true,
                      condition:'commentLength',
                  },{
                      text:'筛选',
                      isShowIcon:false
                  }]
             }
         },
         mounted(){
             this.name = this.$route.query.key;
             this.init();
         },
         watch:{
             $route(to,from){
                 if(to.query.key != from.query.key){
                     this.name = this.$route.query.key;
                     this.init();//重新加载数据
                 }
             }
         },
         methods:{
             toShop(pid){
                 this.$router.push({path:'/shopDetail',query:{pid:pid}})
             },
             choose(index,val){
                 this.chooseFlag=index;
                 if(val.toTop){
                 this.$set(val,'toTop',false);
                 }else {
                     this.$set(val,'toTop',true)
                 }
                 this.realSort(val.isNex,val.toTop,val.condition,val.nextCondition)
             },
             realSort(isNext,tag,condition,nextCondition){
                 if(isNext){
                     this.searchResultShop.sort(this.Sort(tag,condition));
                     this.searchResultShop.forEach(v=>{
                         const result=v.options.sort(this.Sort(tag,nextCondition));
                         this.$set(v,'options',result)
                     })
                 }else {
                     this.searchResultShop.sort(this.Sort(tag,condition));
                 }

             },
             Sort(isDown,content){
                 if(isDown){
                     return function(a,b) {
                         return a[content] - b[content];
                     }
                 }else {
                     return function(a,b) {
                         return b[content] - a[content];
                     }
                 }
             },
            commentConfirm(val){
                this.shopComment.forEach(v => {
                    if (v.pid == val.pid) {
                        this.$set(val, 'commentLength', v.commentLength)
                    }
                });
            },
        init(){
                 this.searchResultShop=[];
                 this.shopComment=[];
                 myApi.post(`/Search`,{name:this.name}).then(res=>{
                     res.forEach(v=>{
                         api.get(`/productDetail?pid=${v.pid}`).then(res=>{
                             this.searchResultShop.push(res)
                             this.searchResultShop.forEach(v=>{
                                 this.commentConfirm(v)
                             })
                         });
                         myApi.get(`/getAllComment?pid=${v.pid}`).then(res=>{
                             this.shopComment.push({
                                 pid:v.pid,
                                 commentLength:res.length,
                             })
                         })
                     });
                 })
             }
         },
         computed:{

         }
     }
</script>
<style lang="scss" scoped>
    .font{
        font-size: 0;
    }
    .fixed{
        position: fixed;
        z-index: 1;
    }
.chooseCtrl{
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    .item{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        height: 37px;
        text-align: center;
        line-height: 37px;
        background-color: #f5f5f5;
    }
}
.paddingTopShow{
    padding-top: 145px;
}
.shopContent{
    font-size: 14px;
    .realPrice{
        font-size: 18px;
        color: #ff6700;
    }
}
.shopItem{
    padding-top: 0;
}
    .marginLeftFont{
        margin-left: 5px;
    }
    .marginFontTop{
        margin-top: 5px;
    }
    .selected{
        color: #ff6700;
    }
    .flex{
        display: flex;
    }
    .column{
        flex-direction: column;
    }
    .row{
        flex-direction: row;
    }
    .padding{
        padding: 15px 15px;
    }
    .justCenter{
        justify-content: center;
    }
    .alignCenter{
        align-items: center;
    }
    .bgwhite{
        background-color: white;
    }
    .border{
        position: relative;
    }
    .border:after{
        position: absolute;
        content:'';
        bottom: 5px;
        left:50%;
        transform: translateX(-50%);
        height: 1px;
        width: 90%;
        background-color: #e5e5e5;
    }
</style>