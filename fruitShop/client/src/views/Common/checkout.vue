<template>
    <div class="checkoutView">
        <navbar :navbarTitle="'确认订单'"/>
        <div class="chooseAddress">
            <router-link :to="{ path: '/address', query: { isOrder: true }}" v-if="noDefaultAddress" class="noneChoose">
                <div class="flex row alignCenter">
                    <van-icon name="plus" size="16px" color="#7a7a7a" />
                    <span class="marginLeft">{{noAddress?'点击新增收货地址':'点击选择收货地址'}}</span>
                </div>
            </router-link>
            <div class="addressMs" v-else>
                <div class="addressContent">
                    <span class="recipient">{{isDefaultAddress.recipient}} {{isDefaultAddress.phone}}</span>
                    <span class="addressDetail">{{isDefaultAddress.province}}-{{isDefaultAddress.city}}-{{isDefaultAddress.county}} {{isDefaultAddress.address}}</span>
                </div>
                <router-link :to="{ path: '/address', query: { isOrder: true }}" class="changeButton">
                    <div>修改</div>
                    <van-icon name="arrow" size="14px" color="#e5e5e5"/>
                </router-link>
            </div>
        </div>
        <div class="distribution padding ">
            <span>配送时间</span>
            <span class="chooseTime">立即配送</span>
        </div>
        <div class="paddingLR bgWhite orderGoods">
            <order-goods :merchandise="merchandise"/>
            <div class="remark paddingTB">
                <span class="tip">备注留言:</span>
                <input  type="text" placeholder="请注明，是否需要清洗要求" v-model="remark"/>
                <van-icon   name="close" class="item closeIcon" size="4.5vw" v-show="openClear" @click="clearRemark"/>
            </div>
        </div>
        <div class="orderFeeView">
            <order-fee :goodsPrice="totalPrice" :packFee="packFee.toString()" :freight="freight.toString()"/>
        </div>
        <div class="pay">
            <pay-mode :totalPrice="realTotalPrice"/>
        </div>
        <div class="confirm">
            <div class="totalPrice padding">
                <span>合计：</span>
                <span class="price">￥{{realTotalPrice}}</span>
            </div>
            <button class="confirmButton padding" :class="disable?'confirmDisable':''" @click="checkout" :disable="disable">确认</button>
        </div>
        <balance-pay v-show="showPayMode" />
        <van-dialog
                v-model="noReserve"
                title="以下商品库存不足,请重新选择购买"
                center
                show-cancel-button
                @confirm="confirm"
        >
           <div class="noReserve">
               <van-icon name="cross" color="white" size="48px" class="icon"/>
               <div class="goods">
                   <div class="item" v-for="(item,index) in errCarts" :key="index">
                       <span>商品名称：{{item.doc.name}}</span>
                       <span>库存数量：{{item.doc.reserve}}个</span>
                       <span>您的购买数量：{{item.yourNum}}个</span>
                   </div>
               </div>
           </div>
        </van-dialog>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import orderGoods from '../../components/order/orderGoods.vue'
    import orderFee from '../../components/order/orderFee.vue'
    import payMode from '../../components/checkout/payMode.vue'
    import balancePay from '../pay/balancePay.vue'
    import payFail from '../../components/pay/payFail.vue'
    import {api} from '../../utils/api'
    import {mapState} from 'vuex'
    import {Icon, Radio,Dialog} from 'vant'
    import Vue from 'vue'
    Vue.use(Icon).use(Radio).use(Dialog);
    export default{
        components:{
            navbar,
            orderGoods,
            orderFee,
            payMode,
            balancePay,
            payFail
        },
        data(){
          return{
              isDefault:true,
              remark:'',
              openClear:false,
              isDefaultAddress:{},
              noDefaultAddress:false,
              noAddress:false,
              packFee:0,
              freight:0,
              noReserve:false,//没有库存模态框
              errCarts:[], //没有库存的商品
              disable:false,//确认创建订单后禁用按钮
          }
        },
        created(){
            this.packFee=(this.totalNum*2).toFixed(2);
            this.freight=(4).toFixed(2);
            const totalPrice=Number(this.totalPrice)+Number(this.packFee)+ Number(this.freight);
            this.$store.dispatch('carts/changeTotalPrice',totalPrice);
            this.defaultAddress();
        },
        methods:{
          async defaultAddress(){   //默认地址
               const data=await api.get(`/address`);
               const userAddress=data.result;
               if(data.result.length==0){
                   this.noDefaultAddress=true;
                   this.noAddress=true;
              }else {
                   this.noAddress=false;
                   for(let i=0;i<userAddress.length;i++){
                       if(userAddress[i].isDefault){
                           this.isDefaultAddress=userAddress[i];
                       }
                   }
                   this.isDefaultAddress!=={}?this.noDefaultAddress=false:this.noDefaultAddress=true;
               }
           },
            clearRemark(){  //清除留言按钮
                this.remark='';
                this.openClear=false;
            },
            async checkout(){
                api.get('/payPassword').then(res=>{
                    api.post('/checkReserve',{merchandise:this.merchandise,_slient:true},).then(res=>{
                        let data={
                            carts:this.merchandise,
                            address:this.isDefaultAddress,
                            totalNum:this.totalNum,
                            totalPrice:this.realTotalPrice,
                        };
                        this.disable=true;
                        api.post('/createdOrder',data).then(res=>{
                            this.$store.dispatch('pay/ChangePayId',res.id);
                            this.$store.dispatch('pay/ChangePayPrice',data.totalPrice);
                            this.$store.dispatch('pay/ChangePayShow',true);
                        })
                    },err=>{
                        this.errCarts=err.response.data.data.result.errCart;
                        this.noReserve=true;
                    })
                },err=>{
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
            confirm(){
                this.$router.push('/');
            }
        },
        computed:{
            ...mapState('carts',['merchandise','totalNum','totalPrice','realTotalPrice']),
            ...mapState('payMode',['mode']),
            ...mapState('pay',['showPayMode'])
        },
        watch:{
            remark(){
                if(this.remark.length>0){
                   this.openClear=true
                }else {
                    this.openClear=false
                }
            },
            showPayMode(){
                if(!this.showPayMode){
                    const timer=setTimeout(()=>{
                        this.$store.dispatch('carts/clearCarts');
                        this.$router.replace({
                            path:'/Orders',
                            query:{
                                orderMode:'timelyOrder'
                            }
                        });
                        clearTimeout(timer)
                    },1200)
                }
            }
        }
    }

</script>
<style lang="scss" scoped>
    @mixin flexCenter{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .checkoutView{
        background-color: $bg-color;
        padding-bottom: 100px;
        .chooseAddress{
            position: relative;
            height: 55px;
            background-color: white;
            padding:10px 10px;
            @include flexCenter;
            z-index: 1;
            .noneChoose{
                position: absolute;
                top:50%;
                @include flexCenter;
                @include transformY(-50%);
                margin: 0 auto;
                width: 80%;
                height: 35px;
                font-size: 14px;
                color: $text-color;
                border: 2px dashed $line-color;
                background-color: white;
            }
            .addressMs{
                width: 355px;
                height: 55px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                background-color: white;
                .addressContent{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: space-between;
                    width: 284px;
                    height: 100%;
                    .recipient{
                        font-weight: bold;
                        flex: 1;
                    }
                    .addressDetail{
                        flex: 1;
                        width: 100%;
                        @include LongtextHidden;
                        font-size: 14px;
                    }
                }
                .changeButton{
                    width: 40px;
                    font-size: 12px;
                    color: $text-color;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
            }
        }
        .distribution{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background-color: white;
            margin-top: 15px;
            .chooseTime{
                color: $main-color;
            }
        }
        .orderGoods{
            margin-top: 15px;
            .remark{
                display: flex;
                flex-direction: row;
                align-items: center;
                .tip{
                    width: 70px;
                }
                input{
                    margin-left: 15px;
                    font-size: 14px;
                    outline: none;
                    flex-grow: 2;
                    border: none;
                    width: 250px;
                }
                .closeIcon{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                }
            }
            .border:after{
                position: absolute;
                @include transformX(-10px);
                width: 375px;
            }
        }
        .orderFeeView{
            margin-top: 15px;
            padding:0 10px;
            background-color: white;
            .border:after{
                height: 0;
            }
        }
        .pay{
            margin-top: 15px;
            background-color: white;
        }
        .chooseAddress:after{
            @include addressLine;
        }
        .confirm{
            position: fixed;
            bottom: 0;
            width: 375px;
            height: 45px;
            display: flex;
            flex-direction: row;
            background-color: white;
            z-index: 3;
            .totalPrice{
                width: 50%;
                .price{
                    font-size: 18px;
                    font-weight: 400;
                }
            }
            .confirmButton{
                width: 50%;
                @include reloadButton;
                background-color: $main-color;
                color: white;
            }
            .confirmDisable{
                background-color: #e6e6e6;
                cursor: not-allowed;
            }
        }
        .noReserve{
            position: relative;
            display: flex;
            flex-direction: column;
            min-height: 180px;
            max-height: 250px;
            overflow-y: scroll;
            background-color: rgba(242, 0, 0, 0.56);
            color:white;
            .icon{
                position: fixed;
                top:50%;
                left: 50%;
                @include transformXY(-50%,-50%);
                opacity: 0.35;
            }
            .goods{
                padding:10px 10px;
                .item{
                    display: flex;
                    flex-direction: column;
                    padding-bottom: 15px;
                }
            }
        }
    }

</style>