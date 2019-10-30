<template>
    <div class="bg">
        <navbar :navbarTitle="'订单详情'" />
        <div class="collageOrderDetailView">
            <order-state :collageOrderDetail="collageOrderDetail"/>
            <location :isOrder="true" ref="location"/>
            <pick-up-time :time="collageOrderDetail.timeLimit"/>
            <div class="barcodeView" v-if="collageOrderDetail.pickUpNum!=0">
                <svg  id="barcode"></svg>
            </div>
            <collage-content  v-if="collageOrderDetail.goods":collage="collageOrderDetail" :isDetail="true" class="paddingLR"/>
            <order-ms-view  class="paddingLR bgWhite" :isCollage="true" :state="collageOrderDetail.state" :totalPrice="(Number(collageOrderDetail.price).toFixed(2)).toString()" :createdTime="collageOrderDetail.createdTime"  :orderNum="collageOrderDetail.orderNum" :cancelTime="collageOrderDetail.cancelTime"/>
            <collage-order-control :State="collageOrderDetail.state" :id="collageOrderDetail._id" @openShare="openShare" @payNow="payNow" @buyAgain="buyAgain" @pickUpShopDetail="pickUpShopDetail"/>
        </div>
        <share :isCollage="true" v-show="share"  ref="share" :order="true" @openTabbar="openTabbar"/>
        <pay v-if="payMode" @payModeShow="Show" :totalPrice="collageOrderDetail.price"  :payId="collageOrderDetail._id" :isCollageCheckout="true"/>
    </div>
</template>
<script>
     import JsBarCode from 'jsbarcode'
     import orderState from '../../../components/collage/collageState.vue'
     import collageContent from '../../../components/orderDetail/collageContent.vue'
     import orderMsView from '../../../components/orderDetail/orderMs.vue'
     import pickUpTime from '../../../components/collage/pickUpTimes.vue'
     import location from '../../../components/collage/collageLocation.vue'
     import collageOrderControl from '../../../components/collage/collageControl.vue'
     import pay from '../../../components/pay/inPayMode.vue'
     import navbar from '../../../components/navbar.vue'
     import share from '../../../components/share.vue'
//     utils
     import timeTransForm from '../../../utils/timeTransForm'
     import {Icon} from 'vant'
     import {mapState} from 'vuex'
     import Vue from 'vue'
     import {api} from '../../../utils/api'
     Vue.use(Icon);
    export default{
      components:{
          orderState,
          collageContent,
          orderMsView,
          collageOrderControl,
          pickUpTime,
          location,
          navbar,
          share,
          pay
      },
        data(){
          return{
              shop:{
                  name:'琼海市东风路店',
                  address:'琼海市东风路62号（百家汇超市对面）',
                  openTime:'08:00-23:00'
              },
              timeLimitString:'',
              share:false,
              payMode:false,
              collageOrderDetail:{},
          }
        },
        beforeDestroy(){
            this.$store.dispatch('pay/Clear');
        },
        methods:{
            openShare(){
                this.share=true;
                this.$refs.share.openShare=true;
                this.$store.dispatch('tabbar/changeHidden',true);
            },
            buyAgain(){
                this.$router.push({
                    path:'/Collage/checkout',
                    query:{
                        id:this.collageOrderDetail.parentID
                    }
                })
            },
            Show(val){
                this.payMode=val;
            },
            payNow(){
                api.get('/payPassword').then(res=>{
                    this.payMode=true;
                }).catch(err=>{
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
                })

            },
            openTabbar(val){
                this.share=false;
                this.$store.dispatch('tabbar/changeHidden',val);
            },
            shareData(collageOrder){
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
                data.mainImageUrl=collageOrder.goods.goodsImg[0];
                data.qrCodeText=`http://sunnyboy1994.gitee.io/practice/fruitShop/dist/#?Collage/checkout?id=${collageOrder.parentID}&&createdId=${collageOrder.createdId}`;
                data.nameAndDesc=collageOrder.goods.name+collageOrder.goods.desc;
                data.spec=collageOrder.goods.spec;
                data.realPrice=collageOrder.price;
                data.price=collageOrder.goods.realPrice;
                data.mode=collageOrder.mode;
                data.timeLimit=this.timeLimitString;
                this.$store.dispatch('share/CreatedShare',data);
            },
            pickUpShopDetail(){
                this.$router.push({
                    path:'/shopMapDetail',
                    query:{
                        id:this.collageOrderDetail.pickupShop.id
                    }
                })
            },
            pickUpCodeRender(code){
                JsBarCode("#barcode").options({font: "OCR-B"}).CODE128(code, { height:120,displayValue:true,textMargin:10}).render();
            }
        },
        mounted(){
            const id=this.$route.query.id;
            api.get(`/getCollageOrder?id=${id}`).then(res=>{
                this.collageOrderDetail=res;
                this.$refs.location.Shop=res.pickupShop;
                this.pickUpCodeRender(res.pickUpNum);
                this.timeLimitString=timeTransForm(this.collageOrderDetail.timeLimit);
                this.shareData(this.collageOrderDetail);
            });

        }
    }
</script>
<style lang="scss" scoped>
    .bg{
        background-color: $bg-color;
    }
    .barcodeView{
        background-color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .orderAddress{
        position: relative;
        background-color: white;
        .left{
            span{
                margin-top: 5px;
                font-size: 14px;
                color: $text-color;
            }
            span:first-child{
                font-size: 16px;
                margin: 0;
                color: black;
            }
        }
        .right{
            .icon{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width: 45px;
                height: 45px;
            }
            .border:after{
                width: 100%;
            }
        }
    }
    .orderAddress:after{
        @include addressLine;
    }
</style>