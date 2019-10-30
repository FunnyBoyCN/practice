<template>
    <div>
         <back-nav :title="'商品评价'"></back-nav>
         <div  class="main">
             <div class="topChoose  padding flex row spaceBetween bgWhite">
                 <div class="control flex row warp">
                     <div @click="chooseCondition(v)" class="item gray paddingFont normalFont " :class="[chooseFlag===v.index?'choose':'',v.notLeft?'':'marginLeftFont',v.isTop?'marginFontTop':'']" v-for="(v,k) in chooseText" :key="k">{{v.text}}</div>
                 </div>
                 <div class="nowShop justCenter alignCenter column flex">
                     <div class="flex row" @click="chooseNowShop">
                         <div>只查看当前商品</div>
                         <van-checkbox v-model="chooseNow" class="marginLeftFont" checked-color="#ff6700"></van-checkbox>
                     </div>
                 </div>
             </div>
             <title-text :titleName="'全部评论'"></title-text>
             <ul class="comment padding bgWhite" v-show="ChooseComment">
                 <li class="item border marginTop" v-for="(val,index) in ChooseComment"  :key="index">
                     <div class="topMS flex row alignCenter spaceBetween">
                         <div class="left flex row">
                             <div class="avatar flex justCenter alignCenter" :style="randomRGB()">
                                 <van-icon name="smile-o" color="white"></van-icon>
                             </div>
                             <div class="userMs marginLeftFont">
                                 <div class="name">{{val.isAnonymous?val.UserName:'匿名'}}</div>
                                 <div class="time">{{val.time}}</div>
                             </div>
                         </div>
                         <div class="right flex row justCenter alignCenter" >
                             <van-icon name="thumb-circle-o" size="1.8rem" :color="val.isLikeFlag?'#ff6700':'gray'" @click="isLike(val)" ></van-icon>
                             <div class="num marginLeftFont">{{val.isLike}}</div>
                         </div>
                     </div>
                     <div class="textContent padding">{{val.textContent}}</div>
                     <van-image
                             width="100"
                             height="100"
                             :src="val.img"
                             @click="PreImg(val.img)"
                     />
                 </li>
             </ul>
             <skeleton :data="AllComment"></skeleton>
             <to-top></to-top>
         </div>
    </div>
</template>
<script>
   import backNav from '../components/backNav.vue'
   import titleText from '../components/title.vue'
   import skeleton from '../components/skeleton.vue'
   import {myApi} from '../utils/myApi'
   import ToTop from '../components/totop.vue'
   import Vue from 'vue'
   import {Checkbox,Icon,Image,Toast,ImagePreview} from 'vant'
   import 'vant/lib/checkbox/style'
   import 'vant/lib/icon/style'
   import 'vant/lib/image/style'
   import 'vant/lib/toast/style'
   import 'vant/lib/image-preview/style'
   Vue.use(Checkbox).use(Icon).use(Image).use(Toast).use(ImagePreview)
   export default{
    data(){
        return{
            AllComment:[],
            chooseFlag:0,
            chooseNow:false,
            chooseText:[{
                text:'全部',
                index:0,
                notLeft:true
            }, {
                    text:'好评',
                    index:1
                },
                {
                    text:'中评',
                    index:2,
                },
                {
                    text:'差评',
                    index:3,
                    isTop:true,
                    notLeft:true
                },
                {
                    text:'有图片',
                    index:4,
                    isTop:true,
                }
            ],
            ChooseComment:[],
            previewUrl:[]
        }
    },
       computed:{

       },
       mounted(){
           myApi.get(`getAllComment?pid=${this.$route.query.pid}`).then(res=>{ //获取评论
               this.AllComment=res;
               this.AllComment.forEach(v=>{
                   v.isLikeFlag=false;
                   v.time=this.timeTransfrom(v.time);
               });
               this.ChooseComment=this.AllComment;
           })
       },
       methods:{
           timeTransfrom(time) { //时间戳转换
               let date = new Date(time);
               let Month=date.getMonth()+1<10?`0${date.getMonth()+1}`:date.getMonth()+1;
               let Day=date.getDate()<10?`0${date.getDate()}`:date.getDate();
               let Hours=date.getHours()<10?`0${date.getHours()}`:date.getHours();
               let Minutes=date.getMinutes()<10?`0${date.getMinutes()}`:date.getMinutes();
               let Seconds=date.getSeconds()<10?`0${date.getSeconds()}`:date.getSeconds();
               return `${date.getFullYear()}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`;
           },
           randomRGB(){ //随机生成头像颜色
               let R=Math.floor(Math.random()*255);
               let G=Math.floor(Math.random()*255);
               let B=Math.floor(Math.random()*255);
               return{
                   background:`rgb(${R},${G},${B})`
               }
           },
           chooseNowShop(){
               this.chooseFlag=0;
               this.chooseNow=!this.chooseNow;
               this.ChooseComment=this.chooseNowComment();
           },
           chooseNowComment(){
               let allComment;
               if(this.chooseNow){
                   allComment=this.AllComment.filter(item => item.sku==this.$route.query.sku);
               }else {
                   allComment=this.AllComment;
               }
               return allComment;
           },
           chooseCondition(v){
               this.chooseFlag=v.index;
               const AllComment= this.chooseNowComment();
               switch(this.chooseFlag){
                   case 0:
                       this.ChooseComment=AllComment;
                       break;
                   case 1:
                       this.ChooseComment=AllComment.filter(item => item.start===5);
                       break;
                   case 2:
                       this.ChooseComment=AllComment.filter(item => item.start>=3&& item.start<5);
                       break;
                   case 3:
                       this.ChooseComment=AllComment.filter(item => item.start < 3);
                       break;
                   case 4:
                       this.ChooseComment=AllComment.filter(item => item.img.length!=='');
                       break;
               }
           }, //筛选条件查看
           PreImg(url){ //预览图片
               this.previewUrl=url;
               ImagePreview([
                   this.previewUrl
               ]);
           },
           isLike(val){ //点赞操作
                 let Val;
               this.AllComment.forEach((v=>{
                       if(v._id===val._id){
                           Val=v;
                       }
               }));
               const isLike=val.isLike+1;
               if(!val.isLikeFlag){
                   this.$set(val,'isLike',isLike);
                   this.$set(Val,'isLike',isLike);
                   myApi.post('updateLike',{_id:val._id,isLike:isLike}).then(res=>{
                       Toast.success({
                           message:res,
                       })
                   }),
                   this.$set(val,'isLikeFlag',true);
                   this.$set(Val,'isLikeFlag',true);
               }
           },
       },
       components:{
           backNav,
           titleText,
           ToTop,
           skeleton
     }
}
</script>
<style lang="scss" scoped>
   .main{
       padding-top: 50px;
   }
   .control{
       width: 150px;
       .item{
           border-radius: 25px;
       }
   }
   .comment{
           .item{
               .topMS{
                   .left{
                       .avatar{
                           border-radius: 50%;
                           width: 32px;
                           height: 32px;
                       }
                       .userMs{
                           .name{
                               font-weight: bold;
                           }
                           .time{
                               font-size: 12px;
                           }
                       }
                   }
                   .right{

                   }
               }
           }
       .item:first-child{
           margin-top: 0;
       }
           .item:last-child{
              border: 0;
           }

   }




   .paddingFont{
       padding: 5px 5px;
   }
   .padding{
       padding: 15px 15px;
   }
   .paddingBoth{
       padding-left:15px;
       padding-right:15px;
   }
   .paddingBottom{
       padding-bottom: 15px;
   }
   .marginFontTop{
       margin-top: 5px;
   }
   .marginTop{
       margin-top: 15px;
   }
   .MaxPaddingUAD{
       padding-top: 25px;
       padding-bottom: 25px;
   }
   .marginLeftFont{
       margin-left: 5px;
   }
   .normalFont{
       font-size: 14px;
   }
    .flex{
        display: flex;
    }
    .row{
        flex-direction: row;
    }
    .warp{
        flex-wrap: wrap;
    }
    .column{
        flex-direction: column;
    }
    .justCenter{
        justify-content: center;
    }
    .alignCenter{
        align-items: center;
    }
    .spaceBetween{
        justify-content: space-between;
    }
    .darkGray{
        background-color: #7a7a7a;
    }
    .bgWhite{
        background-color: white;
    }
    .gray{
        background-color: #e5e5e5;
    }
    .lightGray{
        background-color: rgba(240, 240, 240, 0.27);
    }
    .choose{
        background-color: #ff6700;
        color: white;
    }
   .border{
       position: relative;
   }
   .border:after{
       position: absolute;
       content:'';
       bottom: 3.5px;
       height: 1px;
       width: 260px;
       background-color: #e5e5e5;
   }
</style>