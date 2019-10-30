<template>
    <div>
        <div class="item marginTop" v-for="item in order" :key="item._id" @click.stop="toDetail(item._id,item.totalPrice)">
            <order-top :state="item.state" :icon="'notes-o'" :orderTime="item.createdTime"/>
            <div class="goodsImg paddingTB border flex row ">
                <template v-for="i in item.carts">
                    <van-image
                            width="65"
                            height="65"
                            :src="i.goodsImg"
                            class="imageItem"
                            fit="cover"
                    />
                </template>
            </div>
            <order-total :totalNum="item.totalNum" :totalPrice="item.totalPrice.toString()"/>
            <step class="state border" :state="item.state"/>
            <div class="button flex row flexEnd" v-if="item.state==0">
                <button class="cancel" @click.stop="cancelOrder(item._id)">取消订单</button>
                <button class="pay" @click.stop="payNow(item._id,item.totalPrice)">立即付款</button>
            </div>
        </div>
        <payMode v-if="payMode" @payModeShow="Show" :totalPrice="totalPrice"  :payId="payId"/>
        <no-data :text="'商品'" v-if="noResult"/>
    </div>
</template>
<script>
    import orderTop from '../../../components/order/orderTop.vue'
    import orderTotal from '../../../components/order/orderTotal.vue'
    import step from '../../../components/order/step.vue'
    import payMode from '../../../components/pay/outPayMode.vue'
    import noData from '../../../components/order/noData.vue'
    import {api} from '../../../utils/api'
    import {mapState} from 'vuex'
    import {Icon,Image,Dialog ,Overlay  } from 'vant'
    import Vue from 'vue'
    Vue.use(Icon).use(Image).use(Overlay );
    export default{
       components:{
           step,
           orderTop,
           orderTotal,
           payMode,
           noData
       },
        data(){
           return{
             order:[],
              totalPrice:0,
               payId:'',
               payMode:false,
               noResult:false
           }
        },
        inject:['reload'],
        mounted(){
               api.get('/order').then(res=>{
                   this.order=res;
                   if(res.length==0){
                       this.noResult=true;
                   }
               })
        },
        methods:{
            toDetail(id,totalPrice){
                this.$store.dispatch('pay/ChangePayPrice',totalPrice);
                this.$store.dispatch('pay/ChangePayId',id);
                this.$router.push({path:'/Orders/timelyOrder/detail',query:{
                    id:id
                }});
            },
            Show(val){
                this.payMode=val;
            },
            cancelOrder(id){
                Dialog.confirm({
                    title: '订单取消',
                    message: '是否取消'
                }).then(() => {
                    api.post('/cancelOrder',{id}).then(res=>{
                        this.reload();
                        this.Notify({ type: 'success', message: res.message})
                    },err=>{
                        this.Notify({ type: 'danger', message: err.response.data.data.message })
                    })
                }).catch(() => {
                    return false;
                });
            },
            payNow(id,totalPrice){
                api.get('/payPassword').then(res=>{
                    this.totalPrice=totalPrice;
                    this.payId=id;
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

            }
        }
    }
</script>
<style lang="scss" scoped>
    .border:after{
        position: absolute;
        @include transformX(-10px);
        width: 375px;
    }
    .item{
        padding:0 10px;
        background-color: white;
        .goodsImg{
            height: auto;
            flex-wrap: wrap;
            .imageItem{
                padding-bottom: 10px;
                margin-left: 15px;
            }
        }
        .total{
            font-size: 14px;
            .price:before{
                @include price;
            }
        }
        .button{
            padding:5px 0;
            button{
                @include reloadButton;
                @include radius(15px);
                padding: 5px 10px;
                font-size: 12px;
                border: 1px solid $text-color;
                box-sizing: border-box;
                margin-left: 15px;
            }
            .cancel{
                color: black;
            }
            .pay{
                border: 0;
                background-color: #ed9400;
                color: white;
            }
        }
    }
</style>