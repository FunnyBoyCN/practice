<template>
    <div class="bg">
        <navbar :navbarTitle="'订单详情'" />
        <div class="timelyOrderDetailView">
            <state-view :state="orderDetail.state" :createdTime="stateViewTime"/>
            <main class="paddingLR">
                <div class="address component addressLine flex column ">
                    <div class="recipientPhone">
                        <span class="recipient">{{address.recipient}}</span>
                        <span class="marginFontLeft phone">{{address.phone}}</span>
                    </div>
                    <div class="addressDetail marginFontTop">{{address.province}}{{address.city}}{{address.county}}{{address.address}}</div>
                </div>
                <div class="timelyTip component flex row spaceBetween border" v-if="orderDetail.state==0">
                    <span>及时达</span>
                    <span>预计{{predictTime}}送达</span>
                </div>
                <order-goods :merchandise="orderDetail.carts"/>
                <order-fee  :goodsPrice="goodsPrice" :packFee="packFee" :freight="freight"/>
                <order-ms-view v-if="orderDetail!=={}" :state="orderDetail.state" :totalPrice="orderDetail.totalPrice" :createdTime="orderDetail.createdTime" :payTime="orderDetail.payTime" :orderNum="orderDetail.orderNum"/>
            </main>
            <order-control :state="orderDetail.state" :createdTime="stateViewTime" @payMode="Show" @parentStop="parentStop" :payId="payId"/>
            <pay v-if="payMode" @payModeShow="Show" :totalPrice="totalPrice"  :payId="payId"/>
        </div>
    </div>
</template>
<script>
    import stateView from '../../../components/orderDetail/state.vue'
    import navbar from '../../../components/navbar.vue'
    import priceView from '../../../components/realPrice.vue'
    import orderMsView from '../../../components/orderDetail/orderMs.vue'
    import orderControl from '../../../components/orderDetail/orderControl.vue'
    import orderFee from '../../../components/order/orderFee.vue'
    import orderGoods from '../../../components/order/orderGoods.vue'
    import pay from '../../../components/pay/inPayMode.vue'
    import {api} from '../../../utils/api'
    import {mapState} from 'vuex'
    import Vue from 'vue'
    import {Image} from 'vant'
    Vue.use(Image);
    export default{
        components:{
            stateView,
            priceView,
            orderMsView,
            orderControl,
            orderFee,
            orderGoods,
            pay,
            navbar
        },
        inject:['reload'],
        created(){
          this.init();
        },
        beforeDestroy(){
            this.$store.dispatch('pay/Clear');
            clearTimeout(this.timer);
        },
        data(){
            return{
                 orderDetail:{},
                 address:{},
                 goodsPrice:`0`,
                 packFee:`0`,
                 freight:`4.00`,
                 predictTime:``,
                 stateViewTime:0,
                 stopTime:0,
                 totalPrice:0,
                 payId:'',
                 timer:'',
                  payMode:false
            }
        },
        methods:{
            Show(val){
                api.get('/payPassword').then(res=>{
                    this.payMode=val;
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
            init(){
                const id=this.$route.query.id;
                this.payId=id;
                api.get(`/order?id=${id}`).then(res=>{
                    this.orderDetail=res;
                    this.totalPrice=this.orderDetail.totalPrice;
                    this.address=this.orderDetail.address;
                    this.goodsPrice=Number(this.goodsPrice);
                    this.packFee=Number(this.packFee);
                    this.orderDetail.carts.forEach(v=>{
                        this.goodsPrice+=v.num*Number(v.price);
                    });
                    this.goodsPrice=this.goodsPrice.toString();
                    this.packFee=(this.orderDetail.totalNum*2).toFixed(2);
                    this.packFee=this.packFee.toString();
                    this.stateViewTime=new Date(this.orderDetail.createdTime.replace(/-/g,'/')).getTime();
                    this.predictTime=this.timeTransForm((new Date(this.orderDetail.createdTime.replace(/-/g,'/')).getTime())+60*60*1000);
                });
            },
            parentStop(val){
                if(val){
                    const timer=setTimeout(()=>{
                        this.reload();
                        clearTimeout(timer);
                    },this.stopTime+500)
                }
            },

            timeTransForm(Time){
              const time=new Date(Time);
              function num(time) {
                    if(time<10){
                            time=`0${time}`
                     }
                        return time;
                }
               return `${num(time.getMonth()+1)}-${num(time.getDate())}  ${num(time.getHours())}:${num(time.getMinutes())}:${num(time.getSeconds())}`
            }
        }
    }
</script>
<style lang="scss" scoped>
    .bg{
        background-color: $bg-color;
    }
    .timelyOrderDetailView{
        background-color: white;
    }
    .component{
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .address{
        position: relative;
          .recipientPhone{
              font-size: 14px;
          }
        margin-bottom: 2px;
      }
    .address::after{
        position: absolute;
        content: '';
        top:0;
        left: 0;
        width: 375px;
        height: 1px;
        background-color: $line-color;
        @include transformX(-10px)
    }
    .timelyTip{
          font-size: 14px;
          color: #ed9400;
      }
    .addressLine{
       position: relative;
    }
    .addressLine:before{
        @include addressLine;
        width: 375px;
        @include transformX(-13px)
    }
    .border:after{
        position: absolute;
        @include transformX(-10px);
        width: 375px;
    }
</style>