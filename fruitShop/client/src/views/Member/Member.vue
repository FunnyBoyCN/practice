<template>
    <div class="bg" :style="'height:'+height+'px'" style="padding-bottom: 50PX">
        <fruit-title/>
        <div class="memberTop padding  white">
            <div class=" memberBg">
                <div class="paddingXLR content paddingTop">
                    <div class="memberLogin flex row alignCenter paddingLR">
                        <router-link class="memberAvatar" to="/ownInfo">
                            <van-image
                                    :src="userInfo.avatar?userInfo.avatar:''"
                                    fit="cover"
                                    height="14vw"
                                    width="14vw"
                                    round
                            />
                        </router-link>
                        <div class="memberGuide marginLeft flex column flexEnd" v-if="!isLogin">
                            <router-link type="a" to="/Member/Login" class="guideLink flex row alignCenter" >
                                <span class="FontLarge" >登录/注册</span>
                                <van-icon name="arrow" color="white" class="icon marginFontLeft"/>
                            </router-link>
                            <span class="marginFontTop FontMini lightGray">立即开启水果之旅</span>
                        </div>
                        <div class="memberMs marginLeft flex column alignCenter" v-else>
                            <div class="memberMsPhone FontNormal">{{userInfo.phone}}</div>
                            <div class="memberMsRank marginTop flex row alignCenter justCenter bgLightGray">
                                <span class="Fontmini">普卡会员</span>
                                <van-icon name="arrow" color="white" size="10px"/>
                            </div>
                        </div>
                    </div>
                    <div class="memberAssets padding marginTop">
                        <ul class="flex row spaceBetween paddingLR">
                            <li class="integral ">
                                  <div class="item flex column alignCenter spaceBetween">
                                        <start-five v-show="!isLogin"/>
                                        <span v-show="isLogin">{{integral}}</span>
                                        <span >积分商城</span>
                                  </div>
                            </li>
                            <li class="coupon">
                                <div class="item flex column alignCenter spaceBetween">
                                       <start-five v-show="!isLogin"/>
                                        <span v-show="isLogin">{{discount}}</span>
                                        <span>优惠券</span>
                                </div>
                            </li>
                            <li class="wallet">
                                <router-link type="a" :to="{path:'/account'}">
                                    <div class="item flex column alignCenter spaceBetween">
                                        <start-five v-show="!isLogin"/>
                                        <span v-show="isLogin">{{balance}}</span>
                                        <span>钱包·充值</span>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="memberSlogan flex row justCenter alignCenter">
                        <span class="text FontLarge">做用户最满意的水果商城</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="memberBottom   paddingXLR">
            <div class="flex row spaceBetween memberPreferential">
                <div class="item memberSign paddingLR flex column alignCenter justCenter"  @click.stop="toUrl('/Member/singIn')">
                    <div class="titleIcon flex row  alignCenter justCenter">
                        <van-icon name="sign" class="paddingFontTB" size="6.5vw"></van-icon>
                        <span class="marginFontLeft">签到</span>
                    </div>
                    <div class="ds marginFontTop">赢积分 集果卡 换好礼</div>
                </div>
                <div class="item memberCode paddingLR flex column  alignCenter justCenter" @click.stop="toUrl('/memberCode')">
                    <div class="titleIcon flex row  alignCenter justCenter">
                        <van-icon name="idcard"  class="paddingFontTB" size="6.5vw"></van-icon>
                        <span class="marginFontLeft">会员码</span>
                    </div>
                    <div class="ds marginFontTop">
                        到店扫码 便捷支付
                    </div>
                </div>
            </div>
            <van-grid square :border="false" class="marginTop memberOthers paddingXLR bgWhite" :column-num="4">
                <van-grid-item v-for="(item,index) in grid" :key="index" @click.stop="gridClick(item)">
                    <div class="flex column justCenter alignCenter item">
                        <van-icon :name="item.icon" size="5.5vw" color="#7a7a7a"></van-icon>
                        <span class="marginFontTop">{{item.name}}</span>
                    </div>
                </van-grid-item>
            </van-grid>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import fruitTitle from '../../components/title.vue'
    import startFive from '../../components/member/startFive.vue'
    import {api} from '../../utils/api'
    import axios from 'axios'
    import {Image,Icon,Grid, GridItem,Dialog} from 'vant'
    import Vue from 'vue'
    Vue.use(Image).use(Icon).use(Grid).use(GridItem).use(Dialog);
   export default{
        data(){
          return{
              num:18689772300,
              height:0,
              balance:0,
              integral:0,
              discount:0,
              grid:[{
                  name:'心想商城',
                  icon:'shop-collect-o',
                  url:''
              },{
                  name:'地址管理',
                  icon:'location-o',
                  url:'/address'
              },{
                  name:'客服帮助',
                  icon:'service-o',
                  url:''
              },{
                  name:'礼品卡',
                  icon:'point-gift-o',
                  url:''
              },{
                  name:'意见反馈',
                  icon:'records',
                  url:''
              },{
                  name:'设置',
                  icon:'setting-o',
                  url:'/Member/setting'
              }
              ],
              userInfo:{}
          }
        },
       components:{
           fruitTitle,
           startFive
       },
       methods:{
           gridClick(item){
               this.$router.push(item.url)
           },
           init(){
              return api.get('/userInfoDetail').then(res=>{
                  return res.result;
               });
           },
           toUrl(url){
               this.$router.push(url);
           }
       },
      async beforeRouteLeave (to, from, next) {
            if(to.meta.requireLogin){
                const data=JSON.parse(localStorage.getItem('User'));
                if (data.user.isLogin) {
                    if(to.meta.checkPayPassword){
                        api.get('/payPassword').then(res=>{
                            if(!this.first){
                                this.$router.push({
                                    path:'/checkPayPassword',
                                    query:{
                                        toPath:to.fullPath
                                    }
                                })
                            }else {
                                next();
                            }
                        },err=>{
                            Dialog.alert({
                                title: '您还未设置支付密码',
                                message: '无法查看钱包',
                                confirmButtonText:'立即设置',
                                confirmButtonColor:'#19a251',
                                cancelButtonText:'稍候设置',
                                showCancelButton:true
                            }).then(() => {
                                this.$router.push({
                                    path:'/editPayPassword',
                                    query:{
                                        toAccount:true
                                    }
                                })
                            }).catch(()=>{
                                return false;
                            });
                        })
                    }else {
                        next();
                    }
                } else {
                    next({
                        path: '/notLogin'
                    })
                }
            }else {
                next();
            }

       },
      async created(){
           if(this.isLogin){
               this.init().then(res=>{
                   this.userInfo=res;
                   let account=api.get(`/accounts`);
                   let integral=api.get('/integral');
                  return axios.all([account,integral])
               }).then(axios.spread((res,res2)=>{
                   this.balance=res.result.balance;
                   this.integral=res2.result.integral;
               }))
           }
           this.height=document.documentElement.clientHeight-50
       },

       computed:{
           phone(){
               return `${this.num.toString().slice(0,3)}****${this.num.toString().slice(7,11)}`
           },
           ...mapState('user',['isLogin']),
           ...mapState('firstCheck',['first'])
       }
   }
</script>
<style lang="scss" scoped>
    $card-color:#2E3431;
    $cardText-color:#BFB288;
    @mixin radius($range){
        border-radius: $range;
        -moz-border-radius:$range;
        -webkit-border-radius: $range;
    }
    a{
        text-decoration:none;
        color:white;
    }
    .bg{
        background-color: $bg-color;
    }
   .memberTop{
       width: 355px;
       height: 180px;
       position: relative;
       overflow: hidden;
       z-index: 1;
       .memberBg{
           position: absolute;
           width: 140%;
           height: 200px;
           left: -75px;
           top: -15px;
           z-index: -1;
           border-radius: 0 0 31%  31%;
           -moz-border-radius:0 0 31%  31%;
           -webkit-border-radius:0 0 31%  31%;
           overflow: hidden;
           background: $main-color;
       }
       .content{
           position: absolute;
           left: 75px;
           width: 345px;
           height: 180px;
           padding-top: 25px;
           margin: 0;
           .guideLink{
               height: 24px;
               line-height: 24px;

               span{
                   line-height: 24px;
               }
               .icon{
                   line-height: 24px;
               }
           }
           .memberMs{
               .memberMsRank{
                   height: 20px;
                   @include radius(8px);
                   width: 80%;
               }
           }
           .memberAssets{
               .integral{
                   height: 35px;
               }
               .item{
                   width: 100%;
                   height: 100%;
               }
               span{
                   display: block;
                   font-size: 12PX;
               }
           }
           .memberSlogan{
               position: absolute;
               bottom: 0;
               margin: 0 auto;
               width: 345px;
               height: 45px;
               border-radius: 8px 8px  0 0;
               -moz-border-radius:8px  8px  0  0;
               -webkit-border-radius:8px  8px  0  0;
               overflow: hidden;
               box-shadow:  0px 0px 10px  $card-color;
               background-color: $card-color;
               .text{
                   color: $cardText-color;
               }
           }
       }
   }
    .memberBottom{
        .memberPreferential{
            .item{
                width: 147.5px;
                max-width: 147.5px;
                height: 75px;
                background-color: white;
                @include radius(8px);
                .titleIcon{
                   span{
                       font-size: 14px;
                   }
                }
                .ds{
                    font-size:12px ;
                    width: 120px;
                    text-align: center;
                    color: #7a7a7a;
                }
            }
        }
        .memberOthers{
            @include radius(8px);
            overflow: hidden;
            .item{
                font-size: 12px;
            }
        }
    }

</style>