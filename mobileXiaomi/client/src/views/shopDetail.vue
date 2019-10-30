<template>
    <div class="shopDetail">
       <div class="topImg">
           <van-icon name="arrow-left" class="backIcon" size="1.5rem" color="#b1b1b1" @click="goBack(-1)"/>
           <van-image
                   width="100vw"
                   height="60vh"
                   fit="contain"
                   :src="product.img"
                   @click="PreviewImg(product.img)"
           >
               <template v-slot:loading>
                   <van-loading type="spinner" size="20" />
               </template>
           </van-image>
       </div>
        <div class="productDs">
            <div class="proName">{{product.name}}</div>
            <div class="proText">{{product.desc}}</div>
            <div class="proPrice">
                <div class="realPrice">￥{{isPriceChange?selectedPrice:product.price}}</div>
                <div class="MarkingPrice" v-if="!isPriceChange"><del>￥{{product.market_price}}</del></div>
            </div>
        </div>
        <div class="hardware" v-if="product.hardWare">
            <div class="item" v-for="(v,k) in product.hardWare" :key="k">
                <img :src="v.img">
                <div class="hardwareName">{{v.name}}</div>
               <div class="hardwareDetail">{{v.detail}}</div>
            </div>
        </div>
        <div class="Options margin-top">
            <div class="cell">
                <div class="insideItem">
                <div class="cellTitle">领劵</div>
                <div class="cellContent"><span class="tag textOverflow">{{product.name}}专属 200元优惠券</span></div>
                <div class="cellIcon"><van-icon name="arrow"  size="0.5rem" color="black"/></div>
                </div>
                <div class="insideItem">
                    <div class="cellTitle">促销</div>
                    <div class="cellContent"><span class="normalTag">赠米粉卡，最高含100元话费</span></div>
                    <div class="cellIcon"><van-icon name="arrow"  size="0.5rem" color="black"/></div>
                </div>
            </div>
            <div class="cell">
                <div class="insideItem" @click="isOpenModal=true">
                    <div class="cellTitle">已选</div>
                    <div class="cellContent"><span class="normalTag">{{selectedName}}X{{skuNum}}</span></div>
                    <div class="cellIcon"><van-icon name="arrow"  size="0.5rem" color="black"/></div>
                </div>
            </div>
            <!--商品首页评论-->
            <div class="comment">
                <ul class="content" v-if="AllComment.length!==0">
                    <li class="item" v-for="(v,k) in AllComment" :key="k">
                             <div class="topMS">
                                 <div class="left">
                                     <div class="avatar" :style="randomRGB()">
                                         <van-icon name="smile-o" color="white"></van-icon>
                                     </div>
                                     <div class="userMs marginLeft">
                                         <div class="name">{{v.isAnonymous?v.UserName:'匿名'}}</div>
                                         <div class="time">{{v.time}}</div>
                                     </div>
                                 </div>
                                 <div class="right marginRight">
                                     <van-icon name="thumb-circle-o" size="1.8rem" :color="v.isLikeFlag?'#ff6700':'gray'" @click="isLike(v)"></van-icon>
                                     <div class="num miniFont marginFontLeft">{{v.isLike}}</div>
                                 </div>

                             </div>
                              <div class="commentContent">
                                  <van-image
                                          class="leftimg"
                                          height="150"
                                          fit="contain"
                                          :src="v.img"
                                          @click="PreviewImg(v.img)"
                                  >
                                      <template v-slot:loading>
                                          <van-loading type="spinner" size="20" />
                                      </template>
                                  </van-image>
                                  <div class="textContent marginLeft">{{v.textContent}}</div>
                              </div>
                    </li>
                </ul>
                <div class="padding flex row" v-else >
                    <van-icon name="fail" color="red" size="1.5rem"></van-icon>
                    <div>此商品还没有评价</div>
                </div>
            </div>
            <!--查看全部评价-->
            <div class="bgGray flex column padding margin-top" @click="toShopComment" v-if="AllComment.length!==0">
                     <div class="flex row">
                         <div style="color: #1989fa">查看全部评价</div>
                         <van-icon name="arrow" size="0.5rem" color="#1989fa" class="marginFontLeft"></van-icon>
                     </div>
            </div>
        </div>
        <div class="ZeroFontSize margin-top">
            <van-image v-for="(v,k) in shopImgs" :src="v"  lazy-load class="ZeroFontSize shopImgDetail" >
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <to-top></to-top>
        <div class="bgModal"  v-if="isOpenModal"></div>
        <!--选择商品模态框-->
        <transition enter-active-class="slideInUp" leave-active-class="slideOutDown"  appear >
        <div class="skuModal animated faster" v-if="isOpenModal">
            <div class="fixed" style="background-color: white;">
            <div class="topCtrl rightCenter"><van-icon name="cross" size="1.5rem"  color="black" @click="isOpenModal=false"/></div>
            <div class="skuDetail">
                 <div class="skuImg">
                     <van-image
                             class="Skuimg"
                             fit="contain"
                             :src="sku_img[0]"
                             @click="PreviewImg(sku_img[0])"/>
                 </div>
                <div class="choseSku">
                    <div class="choseSkuPrice">￥{{price}}元</div>
                    <div class="choseSkuDetail">{{choseSkuName}}</div>
                </div>
            </div>
            </div>
            <div class="srollContent">
            <div class="SkuEdition">
                <div class="Title">版本</div>
                <template v-if="product.options">
                <div class="optionLayout editionCtrl" v-for="(val,index) in product.options"  :key="index" @click="selectedOption(index,val.list)" :class="{Active:activeIndex==index}">
                    <div class="editionDetail">{{val.prop1_value}}</div>
                    <div class="editionPrice">{{val.price}}元</div>
                </div>
                </template>
            </div>
            <div class="SkuColor">
                <div class="Title">颜色</div>
                <template v-if="product.options[activeIndex].list">
                <div class="ColorCtrl optionLayout"
                     v-for="(value,index) in product.options[activeIndex].list"
                     :key="index"
                     :class="{Active:colorActive==index}"
                     @click="selectedColor(value,index)">
                    {{value.prop2_value}}
                </div>
                </template>
            </div>
            <div class="SkuNum">
                <div class="title">购买数量</div>
                <van-stepper
                        v-model="skuNum"
                        :min="1"
                        :max="20"
                        integer
                        @change="skuNumChange"
                />
            </div>
            </div>
            <div class="bottomCtrl" @click="selected">
                <div class="btn-bottom">选择</div>
            </div>
        </div>
        </transition>
        <div class="bottomNav">
           <div class="leftNav">
               <div class="leftItem" @click="goHome">
                   <van-icon name="home-o"  size="1.5rem" color="rgba(0,0,0,.54)"/>
                   <div>主页</div>
               </div>
               <div class="leftItem">
                   <van-icon name="shopping-cart-o"  size="1.5rem" color="rgba(0,0,0,.54)" :info="shopNum"  @click="toShopCar"/>
                   <div>购物车</div>
               </div>
           </div>
            <div class="rightNav">
                <div class="addShop" @click="addShop">加入购物车</div>
            </div>
        </div>
    </div>
</template>
<script>
import { Swipe, SwipeItem, Lazyload,Image,Icon,ImagePreview,Stepper,Toast,Loading,Dialog } from 'vant';
import Vue from 'vue'
import  {mapState}   from 'vuex'
import {api} from '../utils/api'
import {myApi} from '../utils/myApi'
import 'vant/lib/swipe/style';
import 'vant/lib/swipe-item/style';
import 'vant/lib/lazyload/style';
import 'vant/lib/image/style';
import 'vant/lib/icon/style';
import 'vant/lib/image-preview/style';
import 'vant/lib/stepper/style';
import 'vant/lib/toast/style';
import 'vant/lib/loading/style';
import 'vant/lib/dialog/style';
Vue.use(Swipe).use(SwipeItem).use( Lazyload).use(Image).use(Icon).use(ImagePreview).use(Stepper).use(Toast).use(Loading).use(Dialog );
import toTop from '../components/totop.vue'
import skeleton from '../components/skeleton.vue'
export default{
    created(){
        this.$store.commit('render/IsHome',false);
        const pid='pid='+this.$route.query.pid;
        api.get(`/productDetail?${pid}`).then((res)=>{
            this.product=res;
            if(this.product.pid==='1'){
                this.product.hardWare=[{
                    img:'https://cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/f0c04e138bfed2b1ebb589de615236d1.png',
                    name:'CPU',
                    detail:'骁龙660八核'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/7692726e7a1dd34a3b1b4ede8aca020d.png',
                    name:'双摄像头',
                    detail:'1200万+500万像素'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/86a3bd46cf4f7f19daa2c3250cf30604.png',
                    name:'超大屏',
                    detail:'6.26英寸'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/a5ab24dcb527e49f970f13b11e000ab1.png',
                    name:'屏幕分辨率',
                    detail:'2280×1080'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/c8ec0829241324e401744da627482560.png',
                    name:'极速畅玩',
                    detail:'6GB'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/8941adac25333e785b9cc78ca11f4f27.png',
                    name:'存储容量',
                    detail:'64GB'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/52ad10a73685342e437e44ea3d29cbff.png',
                    name:'薄',
                    detail:'7.5mm'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/0b4ea0fb21dde2f29df3c20de73539b9.png',
                    name:'持久待机',
                    detail:'3350mAh'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/d1b67a407fb2a1ed42c2c0ce15af3318.png',
                    name:'运营商网络',
                    detail:'4G全网通'
                },{
                    img:'https://i8.mifile.cn/b2c-mimall-media/bfd5ba9ae72c365dee42db14dfae4b0f.png',
                    name:'网络模式',
                    detail:'双卡双待'
                }
                ]
            }
                if(this.product.options){
                    this.sku_id=this.product.options[this.activeIndex].list[this.colorActive].sku_id;
                    this.sku_img=this.product.options[this.colorActive].list[this.colorActive].imgs;
                    this.choseSkuName=this.product.options[this.activeIndex].list[this.colorActive].name;
                    this.price=this.product.options[this.activeIndex].list[this.colorActive].price;
                    this.product.options.forEach((v,k)=>{
                        v.list.forEach((v,k)=>{
                            if(v.sku_id===this.sku_id){
                                this.selectedName=v.name;
                            }
                        })
                    })
                }
            });
    },
    data(){
       return{
           product:[],
           NowPid:0,
           previewUrl:'',
           isOpenModal:false,
           isChosePrice:0,
           bgModalWidth:0,
           bgModalHeight:0,
           skuNum:1,
           activeIndex:0,
           colorActive:0,
           price:1499,
           sku_img:[],
           sku_id:0,
           isPriceChange:false,
           choseSkuName:'',
           selectedName:'',
           selectedPrice:1499,
           flag:0,
           AllComment:[],
           shopImgs:[],
           positionNum:0,
       }
    },
    mounted(){
        this.bgModalWidth=document.documentElement.getBoundingClientRect().width;
        this.bgModalHeight=document.documentElement.getBoundingClientRect().height;
        this.NowPid=this.$route.query.pid;
        if(this.isLogin){
            this.$store.dispatch("userMs/getShopCart");
        }
        myApi.get(`getAllComment?pid=${this.$route.query.pid}`).then(res=>{ //获取评论
            this.AllComment=res;
            this.AllComment.forEach(v=>{
                v.isLikeFlag=false;
                v.time=this.timeTransfrom(v.time);
            });
            this.AllComment=this.AllComment.slice(0,5);
        },err=>{

        });
        myApi.get(`shopDetailImg?pid=${this.NowPid}`).then(res=>{
            this.shopImgs=res[0].imgs
        })
    },
    components:{
      toTop,
        skeleton
    },
    watch:{
        isOpenModal(){    //禁止滚动
            if(this.isOpenModal){
                document.body.style.overflow='hidden'
            }else {
                document.body.style.overflow='scroll'
            }
        }
    },
    computed:{
        ...mapState('userMs',['ShopCartNum','isLogin']),
        shopNum(){
            return this.ShopCartNum===0?'':this.ShopCartNum;
        }
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
        goHome(){
          this.$router.push('/')
        },
        PreviewImg(url){
            this.previewUrl=url;
            ImagePreview([
                this.previewUrl
            ]);
        },
        goBack(num){
            this.$router.go(num)
        },
        selectedOption(index,list){   //选择规格
            this.colorActive=0;
            this.activeIndex=+index;
            this.sku_img=list[this.colorActive].imgs;
            this.price=list[this.colorActive].price;
            this.choseSkuName=list[this.colorActive].name;
        },
        selectedColor(val,index){  //选择颜色
            this.sku_img=val.imgs;
            this.colorActive=index;
            this.choseSkuName=val.name;
        },
        selected(){
            this.sku_id=this.product.options[this.activeIndex].list[this.colorActive].sku_id;
            this.isPriceChange=true;
            this.product.options.forEach((v,k)=>{
              v.list.forEach((v,k)=>{
                    if(v.sku_id===this.sku_id){
                        this.selectedName=v.name;
                        this.selectedPrice=v.price
                    }
                })
            });
            if(this.isLogin){
                for (let i=1;i<=this.skuNum;i++){
                    api.post(`/user/addCart`,{sku_id:this.sku_id}).then(()=>{
                        Toast.success('添加成功');
                        this.$store.dispatch("userMs/getShopCart")
                    });
                }
            }else {
                Toast.fail({
                    duration: 500,
                    message: '请先登录'
                });
                const that=this;
                const timer1=setTimeout(()=>{
                    Dialog.confirm({
                        title: '是否前往登录',
                    }).then(() => {
                        that.$router.push({name:'mine',params:{
                            isOpenModal:true,
                            ToPid:this.NowPid
                        }})
                        clearTimeout(timer1);
                    }).catch(() => {
                        clearTimeout(timer1);
                    });

                },500);
            }
            this.isOpenModal=false;
        },
        skuNumChange(){
            if(this.skuNum>20){
                Toast.fail({
                    mask: true,
                    message: '最大购买数量为20'
                });
                this.skuNum=20;
            }
            if(this.skuNum<1){
                Toast.fail({
                    mask: true,
                    message: '最小购买数量为1'
                });
                this.skuNum=1;
            }
        },
        addShop(){
             this.isOpenModal=true;
        },
        toShopCar(){
            this.$router.push('/shopCar')
        },
        randomRGB(){ //随机生成头像颜色
            let R=Math.floor(Math.random()*255);
            let G=Math.floor(Math.random()*255);
            let B=Math.floor(Math.random()*255);
            return{
                background:`rgb(${R},${G},${B})`
            }
        },
        isLike(val){ //点赞操作
            const isLike=val.isLike+1;
            if(!val.isLikeFlag){
                this.$set(val,'isLike',isLike);
                myApi.post('updateLike',{_id:val._id,isLike:isLike}).then(res=>{
                    Toast.success({
                        message:res,
                    })
                })
                this.$set(val,'isLikeFlag',true);
            }
        },
        toShopComment(){ //查看商品全部评价
            this.$router.push({
                path:'/shopComment',
                query:{
                    pid:this.NowPid,
                    sku:this.sku_id
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .shopImgDetail{
        width: 375px;
    }
.shopDetail{
    background-color: white;
    height: 100%;
    padding-bottom: 64px;
    font-size: 14px;
}
.topImg{
    position: relative;
    .backIcon{
        position: absolute;
        top:25px;
        left: 10px;
        z-index: 3;
        background-color: #7a7a7a;
        border-radius: 50%;
        padding: 5px 5px;
    }
}
.productDs{
    padding: 15px 15px;
    .proName{
        font-size: 20px;
        font-weight: bold;
    }
    .proText{
        font-size: 16px;
        color: #b1b1b1;
        margin: 10px 0;
    }
    .proPrice{
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 14px;
        .realPrice{
            color: #ff6700;
            font-size: 20px;
        }
        .MarkingPrice{
            margin-left:5px ;
            color: #b1b1b1;
        }
    }

}
.hardware{
    overflow-y: auto;
    height: 80px;
    display: flex;
    flex-direction: row;
    .item{
        width: 80px;
        height: 100%;
        min-width: 80px;
        padding: 0 8px;
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
            margin: 0 auto;
            align-self: center;
            width: 24px;
            height: 24px;
        }
        .hardwareName{
            font-size: 14px;
        }
        .hardwareDetail{
           width: 80px;
           white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            align-self: flex-start;
            font-size: 12px;
        }

    }
    .item:after{
        content: '';
        position: absolute;
        right: 0;
        top:50%;
        transform: translateY(-50%);
        background-color: #c6c6c6;
        width: 1PX;
        height: 80%;
    }
    .item:last-child:after{
        width: 0;
    }
}
.Options{
    background-color: white;
    padding:0 20px ;
    .cell{
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-bottom:1px solid #c9c9c9;
        border-top:1px solid #c9c9c9;
        margin-bottom: 15px;
        .insideItem{
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            height: 41px;
            border-bottom:1px solid #c9c9c9;
            box-sizing: border-box;
            padding: 0 20px;
            background-color: rgba(231, 231, 231, 0.4);
            .tag{
                display: block;
                width: 114.58px;
                border-left: 0.5px dashed red;
                border-right: 0.5px dashed red;
                border-top: 1px solid red;
                border-bottom: 1px solid red;
                color: red;
                margin-left: 20px;
                background: white;
                font-size: 14px;
            }
            .normalTag{
                display: block;
                margin-left: 20px;
                width: 200px;
                font-size: 14px;
            }
            .cellIcon{
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                right: 20px;
            }
        }
        .insideItem:last-child{
            border: 0;
        };
    }
}
.comment{
    .content{
        margin-bottom: 15px;
        display: flex;
        flex-direction: row;
        overflow: scroll;
        .item{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 1px solid #e6e6e6;
            border-radius: 8px;
            background-color: rgba(231, 231, 231, 0.4);
            width: 277px;
           height: 202px;
            padding: 15px 15px;
            margin-left: 35px;
            .topMS{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .left{
                    display: flex;
                    flex-direction: row;
                    .avatar{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 34px;
                        height: 34px;
                        border-radius: 50%;
                        background-color: #ff6700;
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
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    background-color: rgba(231, 231, 231, 0.4);
                }
             }
            .commentContent{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-top: 15px;
                height: 150px;
                .leftimg{
                    width: 150px;
                }
                .textContent{
                    width: 100px;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 8;
                    overflow: hidden;
                }
            }
        }
        .item:first-child{
            margin-left: 0;
        }
    }

}
.skuModal{
    width: 335px;
    padding: 0 20px 0 20px;
    position: fixed;
    z-index: 999;
    bottom: 0;
    height: 500.25px;
    background-color: white;
    border-top-left-radius:15px;
    border-top-right-radius:15px;
    overflow-y: scroll;
   .skuDetail{
       width: 335px;
       display: flex;
       flex-direction: row;
       align-items: center;
       justify-content: flex-start;
       .Skuimg{
           width: 104.6px;
           height: 104.6px;
           border: 1px solid #e1e1e1;
       }
       .choseSku{
           display: flex;
           flex-direction: column;
           align-items: flex-start;
           margin-left: 15px;
           .choseSkuPrice{
               font-size: 22px;
               color: #ff6700;
           }
           .choseSkuDetail{
               margin-top: 5px;
               font-size: 14px;
           }
       }
   }
    .srollContent{
        margin-top: 133.5px;
        margin-bottom: 64px;
    }
    .SkuEdition{
        display: flex;
        flex-direction: column;
        .editionCtrl{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            box-sizing: border-box;
        }
    }
    .SkuNum{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #c8c9cc;
        padding: 15px 0;
    }
    .ColorCtrl{
        width: auto;
        display: inline-block;
        padding-left: 15px;
        padding-right: 15px;
        margin-right: 15px;
    }
    .bottomCtrl{
        position: fixed;
        bottom:0;
        width: 335px;
        background-color: white;
        padding: 15px 0;
        .btn-bottom{
            padding: 5px 5px;
            font-size: 16px;
            border-radius: 15px;
            background-color: #ff6700;
            color: white;
            text-align: center;
        }
    }
}
.bgModal{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.2);
    position: absolute;
    top: 0;
}
.bottomNav{
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(255,255,255,0.8);
    box-shadow: 2px 2px 10px #9c9c9c;
    border-radius: 13px;
    height: 54px;
    width: 95%;
    .leftNav{
        display: flex;
        flex-direction: row;
        width: 40%;
        align-items: center;
        height: 100%;
        text-align: center;
        .leftItem{
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-grow: 1;
            font-size: 12px;
            line-height: 100%;
            color: rgba(0,0,0,.54);
            div{
                padding-top: 3px;
            }
        }
    }
    .rightNav{
        display: flex;
        flex-direction: column;
        justify-content:center;
        align-items: center;
        width: 50%;
        .addShop{
            background-color: #ff6700;
            color: white;
            font-size: 16px;
            border-radius: 20px;
            padding: 5px 15px;
        }
    }
}
/*适用class*/
.margin-top{
    margin-top: 15px;
}
   .marginLeft{
       margin-left: 10px;
   }
   .marginFontLeft{
      margin-left: 5px;
   }
    .textOverflow{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        align-self: flex-start;
    }
    .rightCenter{
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .leftCenter{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .justCenter{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .fixed{
        position: fixed;
        padding-top: 5px;
    }
.Title{
    padding: 15px 0 20px 0;
    font-size: 14px;
}
.optionLayout{
    border: 1px solid #c9c9c9;
    padding: 10px 0 10px 0;
    margin-bottom: 15px;
    font-size: 14px;
}
.Active{
    border-color:#ff6700;
    color: #ff6700;
}
    .title{
        font-size: 14px;
    }
.miniFont{
 font-size: 12px;
}
    .marginRight{
        margin-right: 10px;
    }
    .bgGray{
        background-color: rgba(231, 231, 231, 0.4);
    }
    .flex{
        display: flex;

    }
    .row{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .column{
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .padding{
        padding: 15px 15px ;
    }
    .ZeroFontSize{
        font-size: 0;
    }
     .noScroll{
         height: 100%;
         overflow: hidden;
     }
</style>