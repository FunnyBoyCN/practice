<template>
    <div>
        <div class="homeHeader">
            <div class="appHeader">
                <div class="HeaderLogo"><img  src="../img/MobileLogo.png"></div>
                <div class="searchinput  topsearch" @click="goSearch">
                    <van-icon name="search" size="1rem" class="marginLeft"></van-icon>
                    <div class="marginLeft">请输入搜索关键词</div>
                </div>
                <div class="mine" @click='toMine'><van-icon name="manager-o" size="1.2rem"/></div>
            </div>
            <div class="headerList">
                <van-tabs v-model="active" animated class="optionList" background="#f2f2f2" @change="ListChange" color="#ff6700">
                    <van-tab v-for="(val,index) in mainData" :title="val.name">
                    </van-tab>
                </van-tabs>
                <div class="openMore"  ><van-icon name="arrow-down" :class="openMoreName" size="0.5rem"/></div>
            </div>
        </div>
        <div class="listContent">
            <div class="child" v-for="(v,k) in mainData" v-show="k==active">
                <van-swipe :autoplay="3000"  @change="swipeChange" >
                    <van-swipe-item v-for="(val, index) in carousel" :key="index" @click="toDetail(val.url.split('?')[1].split('=')[1])">
                        <van-image
                                height="187"
                                fit="cover"
                                :src="val.img"
                                lazy-load
                        >
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                    </van-swipe-item>
                    <div class="custom-indicator" slot="indicator">
                        {{ SwipeLength + 1 }}/{{carousel.length}}
                    </div>
                </van-swipe>
                <div class="nineList" >
                    <template v-if="v.nineList">
                    <img  v-for="(val,index) in v.nineList.img" v-lazy="val" @click="toDetail(1)">
                    </template>
                </div>
                <div class='ListMainImg'>
                    <van-image
                            class='left'
                            fit="cover"
                            :src="v.img"
                            lazy-load
                    >
                        <template v-slot:loading>
                            <van-loading type="spinner" size="20" />
                        </template>
                    </van-image>
                    <div class="right">
                        <img class='left'   src="https://i8.mifile.cn/v1/a1/7803e2d0-e8c1-b824-2fa7-04616b197e9d!358x252.webp">
                        <img class='left'  src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/4b93dda514adf6f39230b15c40c6f91b.jpg?thumb=1&w=358&h=252">
                    </div>
                </div>
                <div class="shopList">
                    <div class="shopItem" v-for="(value,index) in v.list" :key="index" @click="toDetail(value.pid)">
                        <div class="ShopFlag">{{value.flag}}</div>
                        <van-image  :src="value.img"  lazy-load>
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                        <div class="shopDS">
                            <div class="shopTitle">{{value.name}}</div>
                            <div class="shopDesc">{{value.desc?value.desc:'4800万拍照千元机 长续航 “满血版”骁龙660处理器'}}</div>
                            <div class="shopPrice">
                                <div class="price">￥{{value.price}}</div>
                                <div class="market_price"><del>￥{{value.market_price}}</del></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <to-top></to-top>
    </div>
</template>
<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import { Search,Icon,Tab, Tabs,Swipe, SwipeItem,Lazyload,Skeleton,Image,Loading } from 'vant';
import 'vant/lib/search/style';
import 'vant/lib/icon/style';
import 'vant/lib/tab/style';
import 'vant/lib/tabs/style';
import 'vant/lib/swipe/style';
import 'vant/lib/swipe-item/style';
import 'vant/lib/lazyload/style';
import 'vant/lib/skeleton/style';
import 'vant/lib/image/style';
import 'vant/lib/loading/style';
Vue.use(Search).use(Icon).use(Tab).use(Tabs).use(Swipe).use(SwipeItem).use(Lazyload).use(Skeleton).use(Image).use(Loading);
import toTop from '../components/totop.vue'
export default{
    created(){
        this.$store.commit('render/IsHome',true)
        if(this.carousel.length===0||this.mainData.length===0){
            this.$store.dispatch("render/getCarousel");
            this.$store.dispatch("render/getMainData");
        }

    },
    mounted(){
        this.imgWidth=document.documentElement.getBoundingClientRect().width;
    },
   data(){
       return{
           value:'',
           active:'0',//顶部滑动列表内容,
           isOpenMore:false,
           SwipeLength:0,//轮播图长度
           imgWidth:0
       }
   },
    components:{
        toTop
    },
    methods:{
       goSearch(){
           this.$router.push('/Search')
       },
        openMore(){
            this.isOpenMore=!this.isOpenMore;
        },
        ListChange(res){
           this.active=res;
        },
        swipeChange(res){//轮播图滑动监听
              this.SwipeLength=res;
        },
        toDetail(pid){ //跳转商品详情页
            this.$router.push({path:'/shopDetail',query:{pid:pid}})
        },
        toMine(){
            this.$router.push("/mine")
        }
    },
    computed:{
        openMoreName(){
            if(this.isOpenMore){
                return 'closeMoreAnimation'
            }else {
                return 'openMoreAnimation'
            }
        },
        ...mapState('render',["carousel","mainData"]),
        ...mapState({
            loading: state => state['@@loading'].effects['namespace/actions']
        }),
    }
}
</script>
<style lang="scss" >
    .marginLeft{
       margin-left:  10px
    }
.homeHeader{
    position: fixed;
    left: 0;
    right: 0;
    z-index: 99;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2);
    background-color: #f1f1f1;
    .appHeader{
        height: 43.75px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        .HeaderLogo{
            height: 100%;
            width: 31.25px;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 80%;
            }
        }
        .topsearch{
            background-color: white;
            padding: 0;
            border: 1px solid #e5e5e5;
        }
        .searchinput{
            width: 70%;
            height: 25px;
            font-size: 14px;
            text-align: center;
            line-height: 25px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
        }
        .mine{
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
.headerList{
    position: relative;
    .optionList{
        width: 90%;
        overflow: hidden;
    }
    .openMore{
        position: absolute;
        height: 100%;
        width: 10%;
        right: 0;
        top:0;
        z-index: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f1f1f1;
    }
 }
}
.listContent{ //列表内容
    padding-top:87.73px;
    padding-bottom: 50px;
    width: 100%;
    .swipeImg{
        height: 187.5px;
    }
    .custom-indicator {
        position: absolute;
        right: 5px;
        bottom: 10px;
        padding: 2px 5px;
        color: white;
        font-size: 12px;
        background: rgba(0, 0, 0, .1);
    }
    .nineList{
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img{
            width: 20%;
        }
    }
    .ListMainImg{
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 267px;
        .left{
            width: 50%;
            height: 100%;
        }
        .right{
            padding-left: 5px;
            height: 100%;
            display: flex;
            width: 50%;
            flex-direction: column;
            img{
                width: 186px;
                height: 131px;
            }
            img:nth-child(2){
                padding-top: 5px;
            }
        }
    }
    .shopList{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        .shopItem{
            position: relative;
            display: flex;
            flex-direction: column;
            width: 185px;
            padding-right: 2.5px;
            img{
                width: 100%;
                height: 180px;
            }
            .ShopFlag{
                position: absolute;
                top:5px;
                left: 50%;
                transform: translateX(-50%);
                padding: 1px 3px;
                background-color: #83c44e;
                font-size: 10px/*no*/;
                color: gainsboro;
                border-radius: 2px;
            }
            .shopDS{
                padding: 15px 15px;
                background-color: white;
               .shopTitle{
                   font-size: 14px;
               }
                .shopDesc{
                    font-size: 12px;
                    color: #b1b1b1;
                }
            }
            .shopPrice{
                display: flex;
                flex-direction: row;
                align-items: center;
                .price{
                    font-size: 14px;
                    color: #ff6700;
                }
                .market_price{
                    padding-left: 5px;
                    color: gainsboro;
                }
            }
        }
        .shopItem:nth-child(2n){
            padding-right: 0;
            padding-left: 2.5px;
        }
    }

}
.openMoreAnimation{
    transform: rotateZ(0);
    transition: all 0.3s linear;
}
.closeMoreAnimation{
    transform: rotateZ(180deg);
    transition: all 0.3s linear;
}
.skeleton{
    animation: skeleton 1s linear infinite;
}
@keyframes skeleton
{
  0%{
      background-color: #7a7a7a;
  }
   25%{
       background-color: rgba(122, 122, 122, 0.75);
   }
    50%{
        background-color: rgba(122, 122, 122, 0.51);
    }
    75%{
        background-color: rgba(122, 122, 122, 0.76);
    }
    100%{
        background-color: rgb(122, 122, 122);
    }
}
</style>