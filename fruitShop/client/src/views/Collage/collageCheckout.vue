<template>
    <div class="collageCheckOut" :style="{height:height}">
        <navbar :navbarTitle="'确认订单'"/>
        <div class="collageSteps border">
           <div class="stepPoint">
               <div class="item" v-for="item in steps" :key="item">
                   {{item}}
               </div>
           </div>
            <div class="content">
                <div class="item" v-for="item in stepsContent" :key="item.large">
                    <span class="large">{{item.large}}</span>
                    <span class="normal">{{item.normal}}</span>
                </div>
            </div>
        </div>
        <location  ref="location"/>
        <pick-up-time :time="collage.timeLimit"/>
        <collage-content v-if="collage.goods" :collage="collage"  :isDetail="true" :isCheckOut="true" class="paddingLR marginFontTop"/>
        <pay-mode :totalPrice="collage.price"/>
        <div class="confirmPay">
            <div class="item">
                <span class="tip">实付款：</span>
                <span class="payPrice">￥{{collage.price}}</span>
            </div>
            <button class="item confirmButton" :class="disabled?'disabledConfirm':''" @click="toPay" :disabled="disabled"> 立即支付</button>
        </div>
        <balance-pay v-show="showPayMode" :isCollageCheckout="true"/>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import collageContent from '../../components/orderDetail/collageContent.vue'
    import location from '../../components/collage/collageLocation.vue'
    import pickUpTime from '../../components/collage/pickUpTimes.vue'
    import payMode from '../../components/checkout/payMode.vue'
    import balancePay from '../../views/pay/balancePay.vue'
    import { Dialog,Toast } from 'vant';
    import Vue from 'vue';
    Vue.use(Dialog).use(Toast);
    import {api} from '../../utils/api'
    import {mapState} from 'vuex'
    import payFail from '../../components/pay/payFail.vue'
   export default{
       components:{
           navbar,
           collageContent,
           location,
           pickUpTime,
           payMode,
           balancePay
       },
       data(){
           return{
               shop:{

               },
               disabled:false,
               collage:{},
               goods:{

               },
               isFail:false,
               height:0,
               steps:[1,2,3],
               stepsContent:[{
                   large:'选择商品',
                   normal:'开团/参团'
               },{
                   large:'邀请好友',
                   normal:'好友参团'
               },{
                   large:'人满成团',
                   normal:'门店提货'
               }]
           }
       },
       mounted(){
           this.height=document.documentElement.clientHeight-50+'px';
           this.shop={
               name:this.nearbyShop.name,
               address:this.nearbyShop.address,
               openTime:this.nearbyShop.opening,
               id:this.nearbyShop.id,
           };
           this.$refs.location.Shop=this.shop;
           const id=this.$route.query.id;
           const createdId=this.$route.query.createdId;
           this.$set(this.collage,'parentID',id);
           this.$set(this.collage,'pickupShop',this.shop);
            api.get(`/collages?id=${id}`).then(res=>{
                this.$set(this.collage,'goods',res.goodsContent);
                this.$set(this.collage,'mode',res.mode);
                this.$set(this.collage,'price',res.Price);
                this.$set(this.collage,'timeLimit',res.timeLimit);
            });
           if(createdId){
               api.get('/getCollageOrder',{params:{
                   id:createdId
               }}).then(res=>{
                   this.$set(this.collage,'createdPayTime',res.createdPayTime);
               })
           }
       },
       watch:{
           showPayMode(){
               if(!this.showPayMode){
                   const timer=setTimeout(()=>{
                       this.$store.dispatch('tabbar/changeTabbarName','/Orders/timelyOrder');
                       this.$router.replace({
                           path:'/Orders',
                           query:{
                               orderMode:'collageOrder'
                           }
                       });
                       clearTimeout(timer)
                   },1200)
               }
           }
       },
       computed:{
           ...mapState('pay',['showPayMode']),
           ...mapState('nearbyShop',['nearbyShop'])
       },
       methods:{
           toPay(){
               const createdId=this.$route.query.createdId;
               let data=this.collage;
               let id=this.$route.query.id;
               api.get('/payPassword').then(res=>{
                   return api.post('/checkCollageReserve',{id:id,_slient:true})
               },error=>{
                   Dialog.alert({
                       title: '您还未设置支付密码',
                       message: '立即去设置',
                       confirmButtonText:'现在',
                       confirmButtonColor:'#19a251',
                       cancelButtonText:'稍候',
                       showCancelButton:true
                   }).then(() => {
                       this.$router.push({
                           path:'/editPayPassword',
                       })
                   }).catch(()=>{
                       return false;
                   });
               }).then(res=>{
                   if(createdId){
                       return api.post('/createCollageOrder',{id:createdId,data,_slient:true})
                   }else {
                       return api.post('/createCollageOrder',{data,_slient:true})
                   }
               },error=>{
                   this.disabled=true;
                   Toast.fail(error.response.data.data.message)
               }).then(res=>{
                   this.disabled=true;
                   this.$store.dispatch('pay/ChangePayId',res._id);
                   this.$store.dispatch('pay/ChangePayPrice',Number(data.price));
                   this.$store.dispatch('pay/ChangePayShow',true)
               })
           }
       }
   }
</script>
<style lang="scss" scoped>
    .collageCheckOut{
        background-color: $bg-color;
    }
        .collageSteps{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding:10px 10px;
            height: 75px;
            width: 355px;
            background-color: white;
            .stepPoint{
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                height: 45%;
                .item{
                    position: relative;
                    width: 20px;
                    height: 20px;
                    @include radius(50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 14px;
                    border: 1px solid #19cd80;
                    background-color: $main-color;
                }
                .item:before{
                    position: absolute;
                    left: 32px;
                    top: 50%;
                    content: '';
                    margin-top: -1px;
                    width: 80px;
                    height: 2px;
                    background-color: $main-color;
                }
                .item:last-child:before{
                    height: 0;
                }
            }
            .content{
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                height: 55%;
                .item{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    .large{
                        font-size: 14px;
                    }
                    .normal{
                        color: $text-color;
                        font-size: 12px;
                    }
                }
            }
        }
        .confirmPay{
            position: fixed;
            bottom: 0;
            width: 375px;
            height: 50px;
            display: flex;
            flex-direction: row;
            .item{
                flex-grow: 1;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                .tip{
                    font-size: 14px;
                }
                .payPrice{
                    font-size: 18px;
                    color: #ed9400;
                }
            }
            .confirmButton{
                @include reloadButton;
                background-color: #ed9400;
                color: white;
                font-size: 18px;
            }
            .disabledConfirm{
                background-color: gainsboro;
            }
        }
</style>