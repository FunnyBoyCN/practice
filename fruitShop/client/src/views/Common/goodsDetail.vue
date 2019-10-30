<template>
    <div style="background-color: #F7F7F7" class="scrollNone">
        <nav-bar :navbarTitle="'商品详情'"/>
        <template v-if="goodsContent.goodsImg">
            <van-swipe :autoplay="3000" indicator-color="#19a251" >
                <van-swipe-item v-for="(i,index) in goodsContent.goodsImg" :key="'img'+index">
                    <van-image
                            :src="i"
                            height="350"
                            fit="contain"
                    />
                </van-swipe-item>
            </van-swipe>
        </template>
        <div class="goods  border">
            <div class="top flex row alignCenter spaceBetween">
                <div class="flex column spaceBetween goodsDetail" style="height: 100%">
                    <span style="font-size: 16px" class="item">{{goodsContent.name}}</span>
                    <span style="font-size: 14px;color: #7A7A7A;"  class="item">{{goodsContent.desc}}</span>
                    <span style="font-size: 10px;color: #7A7A7A;"  class="item">· {{goodsContent.spec}}</span>
                    <span v-show="goodsContent.reserve<10&&goodsContent.reserve!==0" style="font-size: 10px;color: red;">· 仅剩{{goodsContent.reserve}}件</span>
                </div>
                <div class="integral  flex column  alignCenter" style="height: 100%;justify-content: flex-end">
                    <span style="font-size: 20px;color: #ed9400;">{{Math.floor(Number(goodsContent.realPrice))}}</span>
                    <span style="font-size: 10px;color: #7A7A7A;">购物得积分</span>
                </div>
            </div>
            <van-sticky :z-index="3" :offset-top="46">
                <div class="goodsPrice flex row alignCenter spaceBetween" >
                 <price
                       :color="'#ed9400'"
                       :deColor="'#7a7a7a'"
                       :bigFontSize="22"
                       :smallFontSize="14"
                       :realPrice="goodsContent.realPrice"
                       :price="goodsContent.price"
                       refs="price"
                 />
                <div class="defaultAdd flex row alignCenter justCenter" v-show="Num" @click="addCarts" v-if="goodsContent.reserve!==0">
                    <van-icon name="plus"/>
                    <div >加入购物车</div>
                </div>
                <div class="noReserve" v-else>已售罄</div>
                <good-control :item="goodsContent" v-show="!Num"/>
            </div>
            </van-sticky>
        </div>
        <service/>
        <main class="main">
            <div class="detail paddingXLR">
                <div class="padding flex row justCenter outside">
                    <div class="detailTitle">
                        商品详情
                    </div>
                </div>
                <div class="desc flex column  ">
                    <div class="item flex row border paddingFontTB"  v-for="(item,index) in goodsContent.detail" :key="'detail'+index">
                        <div class="title">{{item.title}}</div>
                        <div class="content">{{item.content}}</div>
                    </div>
                </div>
                <template v-for="(item,i) in goodsContent.goodsDetailImg" >
                    <van-image :src="item"/>
                </template>
            </div>
        </main>
        <price-tip/>
        <share :isCollage="false" />
    </div>
</template>
<script>
    import navBar from '../../components/navbar.vue'
    import goodControl from '../../components/goodsControl.vue'
    import service from '../../components/service.vue'
    import priceTip from '../../components/priceTip.vue'
    import price from '../../components/price.vue'
    import share from '../../components/share.vue'
    import Vue from 'vue';
    import {Swipe, SwipeItem,Image,Sticky} from 'vant'
    Vue.use(Swipe).use(SwipeItem).use(Image).use(Sticky);
    import {api} from '../../utils/api'
    import  {mapState}  from 'vuex'
    export default{
        components:{
            navBar,
            goodControl,
            service,
            priceTip,
            price,
            share,
        },
        data(){
            return{
                goodsImg:[],
                goodsContent:{},
                goodsNum:0,
            }
        },
        methods:{
            addCarts(){
                const data={
                    _id:this.goodsContent._id,
                    num:1,
                    price:this.goodsContent.realPrice,
                    name:this.goodsContent.name,
                    reserve:this.goodsContent.reserve,
                    goodsImg:this.goodsContent.goodsImg[0],
                };
                this.$store.dispatch('carts/addMerchandise',data);
            },
            shareData(){
                const url=this.$route.fullPath;
                const data={
                    mainImageUrl:'',
                    qrCodeText:'',
                    nameAndDesc:'',
                    spec:'',
                    realPrice:'',
                    price:''
                };
                data.mainImageUrl= this.goodsContent.goodsImg[0];
                data.qrCodeText=`http://sunnyboy1994.gitee.io/practice/fruitShop/dist/#${url}`;
                data.nameAndDesc= this.goodsContent.name+this.goodsContent.desc;
                data.spec=this.goodsContent.spec;
                data.realPrice=this.goodsContent.realPrice;
                data.price=this.goodsContent.price;
                this.$store.dispatch('share/CreatedShare',data);
            }
        },
        computed:{
            ...mapState('carts',['merchandise']),
            PriceTranForm(){
                return function (val) {
                    return val.split('.');
                }
            },
            Num(){
                const id=this.$route.query.id;
                const goodsCarts=this.merchandise.filter(item=>{
                     return  item._id==id||'';
                });
                this.goodsNum=goodsCarts[0];
                if(goodsCarts[0]==undefined){
                    this.goodsNum=0
                }else {
                    this.goodsNum=goodsCarts[0].num;
                }
                return this.goodsNum==0
            }//显示或隐藏加入购物车按钮
        },
        watch:{
            merchandise(){


            },

        },
       async mounted(){
           const id=this.$route.query.id;
           const goods=await api.get(`/goodsDetail?id=${id}`);
           this.goodsContent=goods.goodsContent;
           this.shareData();
        }
    }

</script>
<style lang="scss" scoped>
    .van-swipe{
        background-color: white
    }
    .goods{
        background-color: white;
        .van-sticky{

        }
        .top{
            height: 65px;
            padding:15px 15px;

            .goodsDetail{
                width: 262.5px;
                .item{
                    @include LongtextHidden;
                }
            }
            .integral{
                position: relative;
                min-width: 35px;

            }
            .integral:before{
                position: absolute;
                left:-15px;
                bottom: 0;
                height: 50px;
                width: 1px;
                background-color: $line-color;
                content: '';
            }
        }
        .goodsPrice{
            height: 39px;
            padding:5px 15px;
           background-color: white;
            .noReserve{
                font-size: 12px;
                color: $text-color;
            }
            .defaultAdd{
                @include radius(15px);
                padding: 2px 5px;
                background-color: #19944a;
                color: white;
                font-size: 14px;
                width: 100px;
                .van-icon{
                    margin-right: 5px;
                }
            }
        }

    }
    .main{
        background-color: white;
        margin-top: 10px;
        .detail{
            .outside{
                position: relative;
                .detailTitle{
                    position: relative;
                    background-color: $honey-color;
                    padding:2px 5px;
                    font-size: 14px;
                    color: $text-color;
                    width: 45%;
                    text-align: center;
                    @include radius(15px)
                }
                .detailTitle:before{
                    position: absolute;
                    top: 50%;
                    left: 10px;
                    @include transformY(-50%);
                    content: '·';
                }
                .detailTitle:after{
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    @include transformY(-50%);
                    content: '·';
                }
            }
           .outside:before{
                position: absolute;
                content: '';
                height: 1px;
                width: 30px;
                top: 50%;
                @include transformY(-50%);
                text-align: center;
                background-color: $text-color;
                left: 110px;
                z-index: 2;
            }
            .outside:after{
                position: absolute;
                content: '';
                height: 1px;
                width: 30px;
                top: 50%;
                @include transformY(-50%);
                text-align: center;
                background-color: $text-color;
                right: 110px;
                z-index: 2;

            }
            .desc{
                .item{
                    .title{
                        font-size: 12px;
                        color: $text-color;
                        min-width: 80px;
                    }
                    .content{
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .scrollNone::-webkit-scrollbar{
        width: 0;
    }

</style>