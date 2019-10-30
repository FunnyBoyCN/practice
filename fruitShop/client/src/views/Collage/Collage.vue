<template>
    <div>
        <fruit-title class="title"/>
        <header class="header border paddingLR  flex row " >
              <router-link class="shopAddress flex row alignCenter spaceBetween paddingLR" to="/nearbyShop">
                  <span>提货门店:  {{nearbyShop.name}}</span>
                  <van-icon name="arrow" size="3.5vw"/>
              </router-link>
              <div class="search flex column alignCenter justCenter" @click.stop="$router.push('/search')">
                  <van-icon name="search" size="1.3rem"/>
                  <span>搜索</span>
              </div>
        </header>
        <main class="main paddingLR" ref="collage" :style="{height:height+'px'}">
            <div class="collage">
                <div class="item  flex column" v-for="(item,index) in collage" :key="index" @click.stop="collageDetail(item._id)">
                    <div class="itemTop">
                        <div class="bg flex row flexEnd alignCenter">
                                <van-image
                                    :src="item.goodsContent.goodsImg[0]"
                                    width="120"
                                    height="120"/>
                            <div class="content paddingLR flex column ">
                                <span style="font-size: 14px;color: white">{{item.goodsContent.name}}</span>
                                <span style="font-size: 12px;color: white">{{item.goodsContent.desc}}</span>
                                <span class="mode">{{item.mode}}人成团，每人限购一次</span>
                                <div class="price">
                                    <span class="big" style="font-size: 26px">{{PriceTranForm(item.Price)[0]}}</span>
                                    <span class="small" style="font-size: 10px">.{{PriceTranForm(item.Price)[1]}}元</span>
                                    <span class="small" style="font-size: 10px">/{{SpecTranForm(item.goodsContent.spec)[1]}}</span>
                                </div>
                                <div style="font-size: 10px;color: white">零售价:{{item.goodsContent.realPrice}}元/{{SpecTranForm(item.goodsContent.spec)[1]}}</div>
                                <div style="font-size: 10px;color: slateblue">备注：活动时间{{timeLimit(item.timeLimit[0])}}-{{timeLimit(item.timeLimit[1]).split('年')[1]}}</div>
                            </div>
                        </div>
                        <div class="collageMode ">
                            {{item.mode}}人团
                        </div>
                    </div>
                    <div class="itemBottom paddingXLR paddingFontTB flex column spaceBetween">
                        <div>
                           <span class="collageName">
                            {{item.goodsContent.name}} {{item.goodsContent.desc}}
                        </span>
                            <span class="goodsSpec marginTop" style="display: block">
                              {{item.goodsContent.spec}}
                        </span>
                        </div>
                        <div class="control paddingFontTB flex row spaceBetween">
                            <div class="left flex row spaceBetween alignEnd" >
                                <div class="price">
                                    <span class="big">{{PriceTranForm(item.Price)[0]}}</span>
                                    <span class="small">.{{PriceTranForm(item.Price)[1]}}元</span>
                                </div>
                                <del class="oldPrice">{{item.goodsContent.realPrice}}元</del>
                                <div class="collageGroups">已团{{item.groups}}件</div>
                            </div>
                            <div class="goCollage paddingLR paddingFontTB flex row alignCenter justCenter" @click.stop="collageDetail(item._id)">
                                <span>去拼团</span>
                                <van-icon name="arrow" size="3vw"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
<script >
     import {api} from '../../utils/api'
     import BScroll from '@better-scroll/core'
     import {mapState} from 'vuex'
     import {Icon,Image} from 'vant'
     import Vue from 'vue'
     Vue.use(Image).use(Icon);
     import fruitTitle from '../../components/title.vue'
    export default{
        data(){
            return{
                collage:[],
                price:'9.09元',
                height:0,
            }
        },
        components:{
            fruitTitle
        },
        async mounted(){
           this.collage=await  api.get('/collages');
           this.height=document.documentElement.clientHeight;
            this.$nextTick(() => {
                if(!this.bs2){
                    this.bs2 = [new BScroll(this.$refs.collage, {
                        scrollY: true,
                        click: true,
                        bounceTime:500
                    })];
                }else {
                    this.bs2.refresh();
                }

            })
        },
        computed:{
            PriceTranForm(){
                return function (val) {
                    return val.split('.');
                }
            },
            SpecTranForm(){
                return function (val) {
                    return val.split('/');
                }
            },
            timeLimit(){
                return function (val) {
                    const newVal=val.split('-');
                    newVal[0]+='年';
                    newVal[1]+='月';
                    newVal[2]+='日';
                    const reg=new RegExp(/\,/g)
                    return newVal.toString().replace(reg,'');
                }
            },
            ...mapState('nearbyShop',['nearbyShop'])
        },
        methods:{
            collageDetail(id){
                this.$router.push({
                    path:'/Collage/detail',
                    query:{
                        id:id
                    }
                })

            }
        }
    }
</script>
<style lang="scss" scoped>
    .title{
        position: fixed;
        top: 0;
        z-index: 3;
    }
.header{
    position: fixed;
    top: 45PX;
    height: 30PX;
    width: 365px;
    padding-top: 8PX;
    padding-bottom: 8PX;
    padding-right: 0;
    z-index: 3;
    background: white;
    .shopAddress{
        background-color: $bg-color;
        color: $text-color;
        width: 280px;
        font-size: 14px;
        @include radius(5px)
    }
    .search{
        flex-grow: 1;
        span{
            font-size: 8PX;
        }
    }
}
.main{
    background-color: $bg-color;
    overflow-y:hidden ;
    .collage{
        padding-top: 91PX;
        padding-bottom: 65PX;
        .item{
            margin-top: 15px;
            width: 100%;
            height: 300px;
            @include radius(5px);
            overflow: hidden;
            box-shadow:  0 3px 15px $line-color;
            .itemTop{
                position: relative;
                height: 60%;
                overflow: hidden;
                background-color: white;
                .bg{
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    @include transformX(-50%);
                    width:85%;
                    height: 90%;
                    margin: 0 auto;
                    @include radius(5px 5px 0 0);
                    background:linear-gradient(to right, rgba(179, 144, 255, 0.91), rgba(167, 132, 245, 0.81), rgba(164, 129, 239, 0.71), rgba(160, 133, 237, 0.6)) ;
                   .van-image{
                       position: absolute;
                       bottom: 10px;
                       left:10px;
                       overflow: hidden;
                       @include radius(5px)

                   }
                    .content{
                        width: 145px;
                        padding-left: 0;
                        padding-top: 5px;
                        span{
                            @include LongtextHidden;
                        }
                        .price{
                            position: relative;
                            color: white;
                        }
                        .mode{
                            font-size: 10PX;
                            text-align: center;
                            width: 150px;
                            background-color: slateblue;
                            color: white;
                            @include radius(10px);
                        }
                    }
                }
                .bg:before{
                    position: absolute;
                    content: '';
                    z-index: -1;
                    left: 50%;
                    top:50%;
                    @include transformXY(-50%,-50%);
                    @include radius(10px 10px 0 0);
                    width: 102%;
                    height: 102%;
                    border: 3px  rgba(164, 129, 239, 0.71);
                    border-style: solid double;
                }
                .collageMode{
                    position: absolute;
                    left: 0;
                    top:0;
                    min-width: 50px;
                    background-color: #ed9400;
                    color: whitesmoke;
                    font-size: 14PX;
                    text-align: center;
                    @include radius(5px 0px 5px 0)
                }
            }
            .itemBottom{
                flex-grow: 1;
                height: 40%;
                background-color: white;
                .collageName{
                   font-size: 18px;
                    font-weight: 400;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .goodsSpec{
                    color: $text-color;
                    font-size: 12px;
                }
                .control{
                    align-items: flex-end;
                    .left{
                        min-width: 220px;
                        padding-bottom: 5px;

                        .oldPrice{
                            font-size: 12px;
                        }
                        .oldPrice:before{
                            content: '\00A5';
                            font-size: 12px;
                        }
                        .collageGroups{
                            font-size: 12px;
                            max-width: 75px;
                            color: $text-color;
                        }
                    }
                    .goCollage{
                        @include radius(15px);
                        color: white;
                        background: linear-gradient(to right, rgba(255, 165, 0, 0.54), rgba(255, 165, 0, 0.69),rgba(255, 165, 0, 0.7),orange);
                    }
                }
            }
        }
    }
}
    .price{
        color: #ed9400;
        .big{
            font-size: 24px;
        }
        .small{
            font-size: 16px;
        }
    }
    .price:before{
        content: '\00A5';
        font-size: 24px;
    }
main::-webkit-scrollbar{
        width: 0;
 }
    .border:after{
        background-color: #ececec;
    }
</style>