<template>
    <div >
        <div class="payMode"  @touchmove.prevent v-show="!payShow">
            <div class="close">
                <span class="tip">请选择支付方式</span>
                <van-icon name="cross" size="18px" class="crossIcon" @click="$emit('payModeShow',false)"/>
            </div>
            <pay-mode :totalPrice="totalPrice"/>
            <div class="payButton">
                <button class="toPay" @click.stop="toPay()">确认支付</button>
            </div>
        </div>
        <balance-pay  v-if="showPayMode" :isOutPay="true"  :isCollageCheckout="isCollageCheckout"/>
        <van-overlay
                :show="!payShow"
                :z-index="10"
        />
    </div>
</template>
<script>
    import balancePay from '../../views/pay/innerBalancePay.vue'
    import payMode from '../checkout/payMode.vue'
    import {mapState} from 'vuex'
    import {Overplay } from 'vant'
    export default{
        components: {
            payMode,
            balancePay
        },
        data(){
            return{
                payShow:false,
            }
        },
        methods: {
            toPay(){
                this.$store.dispatch('pay/ChangePayId',this.payId);
                this.$store.dispatch('pay/ChangePayPrice',this.totalPrice);
                this.$store.dispatch('pay/ChangePayShow',true);
                this.payShow = true
            },
            close(){
                this.$emit('payModeShow',false);
            }
        },
        watch:{
            showPayMode(){
                if(!this.showPayMode){
                    this.$emit('payModeShow',false);
                }
            }
        },
        mounted(){
          console.log(this.totalPrice);
            console.log(this.payId);
        },
        computed:{
            ...mapState('pay', ['showPayMode'])
        },
        props: ['totalPrice','payId','isCollageCheckout'],
    }
</script>
<style lang="scss" scoped>
    .payMode{
        position: fixed;
        top:50%;
        left: 50%;
        @include transformXY(-50%,-50%);
        @include radius(5px);
        width: 320px;
        height: 180px;
        background-color: white;
        z-index: 11;
        .close{
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            padding:10px 10px;
            .tip{
                position: absolute;
                left: 50%;
                @include transformX(-50%);
            }
        }
        .toPay{
            @include reloadButton;
            @include radius(5px);
            display: block;
            margin: 10px auto;
            padding:8px 10px ;
            background-color: $main-color;
            color: white;
        }
    }
</style>