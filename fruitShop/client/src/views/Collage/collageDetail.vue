<template>
    <div style="background-color: #f5f5f5">
        <nav-bar :navbarTitle="'商品详情'"/>
        <van-swipe :autoplay="3000" indicator-color="#19a251" >
            <template v-if=" collageDetail.goodsContent">
                <van-swipe-item v-for="(item) in  collageDetail.goodsContent.goodsImg">
                    <van-image
                            :src="item"
                            height="350"
                            fit="contain"
                    />
                </van-swipe-item>
            </template>
        </van-swipe>
        <div class="timeLimit flex row spaceBetween ">
            <div class="left flex row alignCenter">
                <span class="mode">{{collageDetail.mode}}人团</span>
                <div class="price">
                    <price
                            :color="'white'"
                            :bigFontSize="22"
                            :smallFontSize="14"
                            :oldPriceSize="12"
                            :realPrice="collageDetail.Price"
                            :price="goodsContent.realPrice"
                    />
                </div>
            </div>
            <div class="right flex row ">
                <div class="triangle"></div>
                <div class="timeShow flex column alignCenter justCenter">
                    <div v-show="isShow">
                        <span class="title">距结束仅剩</span>
                        <van-count-down :time="timeTransForm()" format="HH:mm:ss:S" millisecond class="marginFontTop"  @finish="finish">
                            <template v-slot="timeData">
                                <span class="item">{{ timeData.hours+timeData.days*24 }}</span>
                                <span class="text">时</span>
                                <span class="item">{{ timeData.minutes }}</span>
                                <span class="text">分</span>
                                <span class="item">{{ timeData.seconds }}</span>
                                <span class="text">秒</span>
                            </template>
                        </van-count-down>
                    </div>
                   <div v-show="!isShow" class="end">活动已结束</div>
                </div>
            </div>
        </div>
        <div class="collageName flex column paddingXLR paddingTB border">
            <div>
                <span>{{goodsContent.name}}</span>
                <span >{{goodsContent.desc}}</span>
                <span >{{collageDetail.Price}}元/{{goodsContent.spec?goodsContent.spec.split('/')[1]:''}}</span>
            </div>
            <div class="collageGroups ">
                <span  >{{goodsContent.spec}}</span>
                <span class="marginLeft groups" >已团{{collageDetail.groups}}件</span>
                <div class="tip flex row alignCenter">
                    <van-icon name="volume" size="12px"/>
                    <span class="marginLeft">人人可开团 · 仅限新用户参团</span>
                </div>
            </div>
        </div>
        <service/>
        <div class="pickUpTime padding">
            <span class="title">提货时间:</span>
            <span class="timeRange">{{timeLimitString}}</span>
        </div>
        <div class="collageDetail ">
            <div class="title border padding">
                商品详情
            </div>
            <div class="collageImg" >
                <template v-if="collageDetail.goodsContent"    >
                    <van-image
                            v-for="item in  collageDetail.goodsContent.goodsImg"
                            :src="item"
                    />
                </template>
            </div>
        </div>
        <price-tip class="marginTop"/>
        <transition name="slide" appear>
        <div class="bottomButton flex row">
            <div class="home flex column" @click="goHome">
                <van-icon name="home-o" size="6.5vw" color="#7A7A7A"/>
                <span class="text">首页</span>
            </div>
            <button class="goCollage flex row alignCenter justCenter" :class="!isShow?'gray':''" :disabled="!isShow" @click="goCollage">
                <div class="flex row alignEnd" v-show="isShow">
                    <real-price  :big="18" :small="18" :text="collageDetail.Price" :color="'white'" :beforeSize="false"/>
                    <span class="opened marginFontLeft" >一键开团</span>
                    <template v-if="collageDetail.goodsContent">
                        <div class="flex row alignCenter">
                            <span style="font-size: 12px" class="marginFontLeft">(单买价</span>
                            <deleted-price :text="collageDetail.goodsContent.realPrice" :fontSize="12"/>
                            <span style="font-size: 12px">)</span>
                        </div>
                    </template>
                </div>
                <span  v-show="!isShow">活动结束</span>
            </button>
        </div>
        </transition>
        <share :isCollage="true"/>
    </div>
</template>
<script>
    import service from '../../components/service.vue'
    import navBar from '../../components/navbar.vue'
    import price from '../../components/price.vue'
    import priceTip from '../../components/priceTip.vue'
    import realPrice from '../../components/realPrice.vue'
    import deletedPrice from '../../components/deletedPrice.vue'
    import share from '../../components/share.vue'
    import Vue from 'vue'
    import {api} from '../../utils/api'
    import timeTransForm from '../../utils/timeTransForm'
    import {SwipeItem,Swipe,Image,CountDown } from 'vant'
    Vue.use(Swipe).use(SwipeItem).use(Image).use(CountDown);
export default{
    components:{
        service,
        navBar,
        price,
        priceTip,
        realPrice,
        deletedPrice,
        share,
    },
    data(){
        return{
            collageDetail:{},
            goodsContent:{},
            endTime:0,
            isShow:true,
            timeLimitString:'',
        }
    },
    computed:{

    },
    destroyed(){

    },
    methods:{
        timeTransForm(){
            let timeLimit;
            const nowTime=Date.now();
            if(this.collageDetail.timeLimit){
                 timeLimit=this.collageDetail.timeLimit[1];
            }
            const reg=new RegExp(/\-/g);
            if(timeLimit){
                timeLimit=timeLimit.replace(reg,'/');
            }
            const endTime=new Date(timeLimit).getTime()+(1000*60*60*24);
            return endTime-nowTime;
        },
        finish(){
           this.isShow=false;
        },
        goHome(){
            this.$router.push('/')
        },
        goCollage(){
            const id=this.$route.query.id;
            this.$router.push({path:'/Collage/checkout',query:{id}});
        },
        shareData(){
            const url=this.$route.fullPath;
            const data={
                mainImageUrl:'',
                qrCodeText:'',
                nameAndDesc:'',
                spec:'',
                timeLimit:'',
                mode:'',
                realPrice:'',
                price:''
            };
            data.mainImageUrl= this.goodsContent.goodsImg[0];
            data.qrCodeText=`http://sunnyboy1994.gitee.io/practice/fruitShop/dist/#${url}`;
            data.nameAndDesc= this.goodsContent.name+this.goodsContent.desc;
            data.spec=this.goodsContent.spec;
            data.realPrice=this.collageDetail.Price;
            data.price=this.goodsContent.price;
            data.mode=this.collageDetail.mode;
            data.timeLimit=this.timeLimitString;
            this.$store.dispatch('share/CreatedShare',data);
        }
    },
    async mounted(){
        const id=this.$route.query.id;
        this.collageDetail=await api.get(`/collages?id=${id}`);
        this.goodsContent=this.collageDetail.goodsContent;
        this.timeLimitString=timeTransForm(this.collageDetail.timeLimit);
        this.shareData();
    }
}
</script>
<style lang="scss" scoped>
    .slide-enter-active{
        transform: translateY(50px);
        @include slideUp(50px);
        animation-delay: 0.5s;
    }
    .slide-leave-active{
        transform: translateY(0);
        @include slideDown(50px);
        animation-delay: 0.5s;
    }
    .van-swipe{
        background-color: white;
    }
    .timeLimit{
        background-color: $SandyBrown-color;
        height: 50px;
        position: relative;
        overflow: hidden;
        padding-left: 10px;
        .left{
            width: 245px;
            .mode{
                font-size: 10px;
                color: white;
                border: 1px solid white;
                @include radius(15px);
                text-align: center;
                padding:0 6px;
            }
            .price{
                margin-left: 15px;
            }
        }

        .triangle{
            position: absolute;
            right: 130px;
            top:50%;
            @include transformY(-50%);
            border-width:40px 25px 40px 25px;
            border-style: solid;
            border-color:transparent $time-color transparent transparent ;
        }
        .timeShow{
            width: 110px;
            height: 40px;
            padding:5px 10px;
            text-align: center;
            .end{
                color: $text-color;
                font-size: 16px;
            }
            background-color: $time-color;
            .title{
                font-size: 12px;
                color: $text-color;
            }
            .item{
                background-color: white;
                font-size: 12px;
                padding:2px 3.5px;
                @include radius(5px)
            }
            .text{
                font-size: 10px;
                color: $text-color;
            }
        }
    }
    .collageName{
        background-color: white;
        span{
            display: inline-block;
        }
        .collageGroups{
            position: relative;
            padding:5px 0 0 0;
            span{
                font-size: 12px;
            }
            .groups{
               color: #ed9400;
            }
            .tip{
                position: absolute;
                right: -15px;
                top:0;
                background-color: #FFDF95;
                color: #FFA717;
                padding:3px 5px;
                @include radius(10px 0px 0px 10px);
                span{
                    font-size: 10px;
                }
            }
        }
    }
    .pickUpTime{
        background-color: white;
        margin-top:10px;
        margin-bottom:10px;
         .title{
             font-size: 14px;
         }
        .timeRange{
            margin-left: 25px;
            font-size: 14px;
            color: #ed9400;
        }
    }
    .collageDetail{
        background-color: white;
        .title{
            font-size: 12px;
        }
        .collageImg{
            padding:10px 15px;
            background-color: white;
        }
    }
    .bottomButton{
        position: fixed;
        bottom: 0;
        height: 50PX;
        width: 100%;
        background-color: white;
        .home{
            align-items: center;
            width: 30%;
            padding: 5px 0;
            .text{
                color: $text-color;
                font-size: 10px;
            }
        }
        .goCollage{
            width: 70%;
            color: white;
            @include reloadButton;
            background-color: #ed9400;
            .opened{
                font-size: 18px;
            }
        }
        .gray{
            background-color: gainsboro;
        }
    }
</style>