<template>
    <div class="payView">
        <van-radio-group v-model="radio" >
        <div class="item memberWallet">
           <div class="left">
               <van-icon name="gold-coin" class="Icon" size="6vw" color="gold"/>
               <span>会员钱包支付</span>
               <span class="balance">(余额:￥{{balance}})</span>
           </div>
            <div class="right">
                <div class="balance" v-if="totalPrice>balance">余额不足</div>
                <van-radio name="memberWallet" checked-color="#19a251" v-if="totalPrice<balance"></van-radio>
            </div>
        </div>
        <div class="item weChatWallet">
            <div class="left">
                <van-icon name="chat" class="Icon" size="6vw" color="#09BB07"/>
                <span>微信支付</span>
            </div>
            <div class="right">
                <van-radio name="weChatWallet" checked-color="#19a251"></van-radio>
            </div>
        </div>
        </van-radio-group>
    </div>
</template>
<script>
    import {Icon,RadioGroup, Radio } from 'vant'
    import {api} from '../../utils/api'
    import {mapState} from 'vuex'
    import Vue from 'vue'
    Vue.use(Icon).use(RadioGroup).use(Radio);
    export default{
        data(){
            return{
                radio:'',
                balance:0,
            }
        },
        props:['totalPrice'],
        mounted(){
            this.radio=this.mode;
            this.balancePay();
        },
        methods:{
            balancePay(){
                api.get('/accounts').then(res=>{
                    this.balance=res.result.balance;
                    if(this.balance-this.totalPrice<0){
                        this.$store.dispatch('payMode/ChangePayMode','weChatWallet');
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        computed:{
            ...mapState('payMode',['mode'])
        },
        watch:{
            radio(value){
                this.$store.dispatch('payMode/ChangePayMode',value);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .payView{
        padding:0 10px;
        z-index: 10;
        background-color: white;
        .item{
            padding-top: 10px;
            padding-bottom: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .Icon{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
            .balance{
                display: inline-block;
                font-size: 14px;
                color: $text-color;
                line-height: 24px;
            }
            .left{
                display: flex;
                flex-direction: row;
                justify-content: space-between;

            }
            .right{
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            span{
                margin-left: 5px;
                font-size: 18px;
                font-weight: 500;
            }
        }
    }
</style>