<template>
    <div >
        <van-overlay
                :show="true"
                z-index="11"
        />
        <div class="pay" @touchmove.prevent :class="showKeyboard?'payPopUp':''" v-show="!fail">
            <div class="top border">
                <van-icon name="cross" size="16px" class="closeIcon" @click="close"/>
                <span class="tip">{{!confirmPrice?'请确认金额':'请输入密码'}}</span>
            </div>
            <div class="payContent padding">
                <div class="payGoods border">
                    <span class="name">
                   <template v-for="item in merchandise">
                      {{item.name}}X{{item.num}}
                   </template>
                     </span>
                    <span class="price">￥{{payPrice.toFixed(2)}}</span>
                </div>
                <div class="confirmPrice" v-show="!confirmPrice">
                    <button class="confirm" @click="confirmPrice=true">输入密码</button>
                </div>
                <div class="payPassword animated" @touchmove.prevent v-show="confirmPrice" :class="[success?'success':'',error?'error shake':'']">
                    <van-password-input
                            :value="value"
                            :focused="showKeyboard"
                            @focus="showKeyboard = true"
                            class="input"
                            :info="!error?info:''"
                            :error-info="error?info:''"
                    />
                </div>
            </div>
        </div>
        <div  @touchmove.prevent>
            <van-number-keyboard
                    :show="showKeyboard"
                    @input="onInput"
                    @delete="onDelete"
                    @blur="showKeyboard = false"

            />
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState} from 'vuex'
    import { Overlay,Icon,PasswordInput, NumberKeyboard,Toast} from 'vant';
    import {api} from '../../utils/api'
    Vue.use(Overlay).use(Icon).use(PasswordInput).use(NumberKeyboard).use(Toast);
    export default{
        data(){
            return{
                showKeyboard:false,
                value:'',
                confirmPrice:false,
                info:'密码为 6 位数字',
                success:false,
                error:false,
                fail:false,
            }
        },
        inject:['reload'],
        beforeDestroy(){
            this.$store.dispatch('pay/Clear');
        },
        props:{
            isCollageCheckout:{
                type:Boolean,
                default:false
            },
            isOutPay:{
                type:Boolean,
                default:false,
            },
        },
        methods:{
            onInput(key) {
                this.value = (this.value + key).slice(0, 6);
            },
            onDelete() {
                this.value = this.value.slice(0, this.value.length - 1);
            },
            close(){
                Toast({
                    message: '支付失败',
                    icon: 'cross',
                    duration:1100
                });
                this.fail=true;
                const timer=setTimeout(()=>{
                    this.$store.dispatch('pay/ChangePayShow',false);
                    clearTimeout(timer)
                },1200)

            }
        },
        watch:{
            value(){
                if(this.value.length==6){
                    let stepOne=Toast.loading({
                        mask: true,
                        message: '支付中...'
                    });
                    switch (this.mode){
                        case 'weChatWallet':{
                            alert('微信支付接口');
                            break;
                        }
                        case 'memberWallet':{
                            api.post('/checkPayPassword',{password:Number(this.value),_slient:true}).then(async res=>{
                                this.success=true; //输入支付密码正确后 创建订单
                                if(!this.isCollageCheckout){
                                    api.post('/createdOrder',{id:this.payId,price:this.payPrice}).then(res=>{ //传入已创建的ID 需要支付金额
                                        stepOne.clear();
                                        Toast.success({
                                            message:res.message,
                                            duration:1000,
                                        });
                                        let timer=setTimeout(()=>{
                                            this.reload();
                                            this.$store.dispatch('pay/ChangePayShow',false);
                                            clearTimeout(timer);
                                        },1100)
                                    },fail=>{   //支付失败
                                        stepOne.clear();
                                        Toast({
                                            message: fail.response.data.data.message,
                                            icon: 'cross',
                                            duration:1100
                                        });
                                        this.$store.dispatch('pay/ChangePayShow',false);
                                    });
                                }else {
                                    api.post('/createdCollageOrder',{id:this.payId,price:this.payPrice}).then(res=>{
                                        stepOne.clear();
                                        this.$store.dispatch('collageOrderDetail/OrderDetail',this.payId).then(()=>{
                                            Toast.success({
                                                message:res.message,
                                                duration:1000,
                                            });
                                            let timer=setTimeout(()=>{
                                                this.reload();
                                                this.$store.dispatch('pay/ChangePayShow',false);
                                                clearTimeout(timer);
                                            },1100);
                                        });
                                    },error=>{
                                        stepOne.clear();
                                        Toast({
                                            message: error.response.data.data.message,
                                            icon: 'cross',
                                            duration:1000
                                        });
                                        this.$store.dispatch('pay/ChangePayShow',false);
                                    });
                                }
                            },err=>{
                                stepOne.clear();
                                this.error=true;
                                this.info=err.response.data.data.message;
                            });
                            break;
                        }
                    }
                }else {
                    this.error=false;
                    this.success=false;
                    this.info='密码为 6 位数字';
                }
            }
        },
        computed:{
            ...mapState('carts',['merchandise','totalPrice','realTotalPrice']),
            ...mapState('payMode',['mode']),
            ...mapState('pay',['showPayMode','payId','payPrice'])
        }
    }
</script>
<style lang="scss" scoped>
    .pay{
        position: fixed;
        bottom:50%;
        left:50%;
        width: 345px;
        height: 200px;
        background-color: white;
        @include transformXY(-50%,50%);
        z-index: 12;
        .top{
            position: relative;
            display: flex;
            padding:10px 10px;
            height: 30px;
            flex-direction: row;
            align-items: center;
            .closeIcon{
                position: absolute;
                left: 10px;
                top:50%;
                @include transformY(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: rgba(25, 148, 74, 0.12);
            }
            .tip{
                margin: 0 auto;
                font-size: 16px;
                font-weight: bold;
            }
        }
        .border::after{
            background-color: #19A251;
            height: 2px;
        }
        .payContent{
            height: 130px;
            display: flex;
            flex-direction: column;
            .payGoods{
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 325px;
                overflow: hidden;
                padding-top: 5px;
                padding-bottom:5px ;
                .name{
                    width: 225px;
                    display: block;
                    text-align: center;
                    @include LongtextHidden;
                }
                .price{
                    margin-top: 5px;
                    font-weight: bold;
                    font-size: 18px;
                }
            }
            .payPassword{
                flex-grow: 1;

                position: relative;
                .input{
                    margin-top: 10px;
                    li::after{
                        border-color: $text-color;
                    }
                }
                .input::after{
                    border-color: $text-color;
                }
            }
            .success{
                background-color: rgba(173, 255, 47, 0.26);
            }
            .error{
                background-color: rgba(255, 0, 0, 0.26);
            }
            .confirmPrice{
                height: 70px;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .confirm {
                    width: 180px;
                    @include reloadButton;
                    margin-top: 10px;
                    color: white;
                    padding:10px 0;
                    background-color: $main-color;
                    @include radius(8px)
                }
            }
            .border::after{
                height: 1px;
                background-color: $line-color;
            }
        }
    }
    .payPopUp{
        position: fixed;
        bottom: 339.75px;
    }
</style>