<template>
    <div>
        <van-overlay
                :show="openDetail&&totalNum!==0"
                @click="openDetail=!openDetail"
                z-index="3"
        />
        <div class="cartsMain" :class="isHidden?'':'bottomPosition'" @touchmove.prevent>
            <transition name="slideLeft">
                <div class="cartMs" v-show="openDetail&&totalNum!==0">
                    <div class="cartMsTop flex row alignCenter padding  spaceBetween FontNormal " >
                        <div class="title">已选商品</div>
                        <div class="clear flex row alignCenter" @click.stop="clearCarts">
                            <van-icon name="delete" color="gray" />
                            <span style="color: gray">清空</span>
                        </div>
                    </div>
                    <div class="cartsMsContent ">
                        <div class="item padding flex spaceBetween paddingTB alignCenter border" v-for="(item,index) in merchandise" :key="index">
                            <div class="flex row alignCenter">
                                <div class="MsName FontNormal">{{item.name}}</div>
                                <div class="MsPrice FontNormal  marginFontLeft orange">￥{{item.price}}元</div>
                            </div>
                            <control :item="item"/>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="slide">
            <div class="cart flex row cartBottom"  v-show="isShow||MountedShow">
                <div class="cartLeft flex row alignCenter">
                    <transition name="zoom">
                    <div ref="shoppingCart" v-show="isShow||MountedShow" class="cartIcon flex alignCenter justCenter" :class="closeCarts?'bgGray':'bgOrange'" @click="openDetail=!openDetail">
                        <van-icon name="shopping-cart"  color="white" size="6.66vw" :info="closeCarts?'':totalNum"></van-icon>
                    </div>
                    </transition>
                    <div class="cover"></div>
                    <div class="cartTotal marginLeft paddingFontTop" v-show="!closeCarts">
                        <h4 class="price orange">￥{{totalPrice}}元</h4>
                        <span class="Fontmini gray">不含运费</span>
                    </div>
                    <div class="cartSlogan marginLeft" v-show="closeCarts">
                        <div class="css1b00b16e0520470 gray">不好吃瞬间退款</div>
                    </div>
                </div>
                <div class="cartButton">
                    <router-link to="/checkout">
                        <van-button class="cartCheck"  :class="closeCarts?'bgGray':'bgOrange'" size="large" >去结算</van-button>
                    </router-link>
                </div>
            </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import control from '../components/goodsControl.vue'
    import {mapState}  from 'vuex'
    import Vue from 'vue'
    import {Button,Icon,Overlay} from 'vant'
    Vue.use(Button).use(Icon).use(Overlay);
   export default{
       data(){
           return{
              mongoliaHeight:0,
              mongoliaWidth:0,
               bgHeight:0,
               openDetail:false,
               closeCarts:false,
               MountedShow:false,
           }
       },
       methods:{
           clearCarts(){
              this.openDetail=false;
              this.closeCarts=true;
               const timer=setTimeout(()=>{
                   this.$store.commit('carts/ClearCarts');
                   clearTimeout(timer)
               },800)
           }
       },
       computed:{
           ...mapState('carts',['merchandise','totalNum','totalPrice']),
           ...mapState('tabbar',['isHidden']),
            isShow:{
                get: function () {
                    return this.totalNum!==0?true:false;
                }
            },
       },
       watch:{
           totalNum(){
               if(this.totalNum!==0){
                   this.closeCarts=false;
               }else {
                   this.closeCarts=true;
               }
           }
       },
       components:{
           control
       },
       mounted(){
           this.mongoliaHeight=document.documentElement.clientHeight+'px';
           this.mongoliaWidth=document.documentElement.clientWidth+'px';
           this.bgHeight=(document.documentElement.clientHeight-50)+'px';
       }
   }
</script>
<style lang="scss" scoped>

        .cartsMain{  //主体
            z-index: 6;
            width: 375px;
            position: fixed;
             bottom: 0;
            .cart{
                background-color: white;
                border-top:1px solid #e5e5e5;
                box-sizing: border-box;
                -moz-box-sizing:border-box;
                -webkit-box-sizing: border-box;
                justify-content: space-between;
                height: 48px;
                .cartIcon{
                    position: absolute;
                    bottom: 8px;
                    left: 10px;
                    border-radius: 50%;
                    border: 6px solid #f5f5f5;
                    width: 40px;
                    height: 40px;
                }
                .cover{
                    width: 62px;
                    height: 40px;
                }
                .cartTotal{
                    h4{
                        margin: 0;
                    }
                    .price{

                    }
                }
                .cartSlogan{
                    font-size: 22px;
                }
                .cartButton{
                    height: 48px;
                    justify-self: flex-end;
                    width: 100px;
                    .cartCheck{
                        height: 100%;
                        width: 100%;
                        border-top: 0;
                        border-bottom:0;
                        color: white;
                    }
                }
                .bgOrange{
                    background-color: $orange-color;
                }
                .bgGray{
                    background-color: #afafaf;
                }
            }
            .cartMs{
                .cartMsTop{
                    background-color: $title-bgColor;
                }
                .cartsMsContent{
                    background-color: white;
                    max-height: 225px;
                    overflow-y: scroll;
                    .item{
                        height: 55px;
                        .MsName{
                            max-width: 120px;
                            min-width: 120px;
                        }
                    }
                    .border:last-child:after{
                        height: 0;
                    }
                    .border::after{
                        left: 0;
                    }
                }
                .cartsMsContent::-webkit-scrollbar{
                    width: 0;
                }
            }
            .cartBottom{
                bottom: 50px;
            }
        }
        .bottomPosition{
            bottom: 50PX;
        }
        .cartMongolia{
            z-index:1;
            position: absolute;
            top:0;
            background-color: $mongolia-color;
        }   //蒙层
        .hiddenIndex{
            z-index: -1;
        }
        .zoom-enter-active{
            animation: zoom-in 0.5s linear;
        }
        .slide-enter,.slide-leave-to{
            opacity: 0;
            transform: translateY(48px);
        }
        .slide-enter-active,.slide-leave-active{
            transition: all 0.3s linear;
        }
        .slide-enter-to,.slide-leave{
            transform: translateY(0px);
            opacity: 1;
        }
    .slideLeft-enter,.slideLeft-leave-to{
        opacity: 0;
        transform: translateX(-100%);
    }
    .slideLeft-enter-active,.slideLeft-leave-active{
        transition: all 0.3s ease-in-out;
    }
    .slideLeft-enter-to,.slideLeft-leave{
        opacity: 1;
        transform: translateX(0);
    }
        @keyframes zoom-in{
            0%{
                transform:scale(1)
            }
            50%{
                transform:scale(1.2)
            }
            100%{
                transform:scale(1)
            }
        }
</style>