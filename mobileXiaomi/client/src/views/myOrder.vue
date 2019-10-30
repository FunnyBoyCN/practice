<template>
    <div>
        <back-nav :title="'我的订单'"></back-nav>
        <div class="OrderContent">
            <div class="OrderTitle">
                <van-tabs v-model="active" animated @click="activeChange">
                    <van-tab v-for="item in title" :title="item">
                    </van-tab>
                </van-tabs>
            </div>
            <div v-show="active==0">
                <order-message :data="allOrder"></order-message>
                <div class="bottomMs row AlignCenter paddingText flexEnd bgWhite" v-if="allOrder.length>0">
                    <div class="miniFont row AlignCenter">共<div class="nanoFont">{{allQuantity}}</div>件商品</div>
                    <div class="miniFont row AlignCenter marginLeftFont">实付金额：<div class="normalFont">{{totalPrice}}元</div></div>
                </div>
                <none-message :content="'任何'" v-if="allOrder.length<=0"></none-message>
            </div>
            <div  v-show="active==1">
                <order-message :data="notPayNum"></order-message>
                <none-message :content="'未付款'" v-if="notPayNum.length<=0"></none-message>
            </div>
            <div  v-show="active==2">
                <order-message :data="payNum"></order-message>
                <none-message :content="'已付款'" v-if="payNum.length<=0"></none-message>
            </div>
        </div>
    </div>
</template>
<script>
    import backNav from '../components/backNav.vue'
    import noneMessage from '../components/noneMessage.vue'
    import orderMessage from '../components/OrderMessage.vue'
    import {myApi} from '../utils/myApi'
    import {api} from '../utils/api'
    import {mapState} from 'vuex'
    import { Tab, Tabs ,Image,Button,Dialog,Toast} from 'vant';
    import Vue from 'vue'
    import 'vant/lib/tab/style'
    import 'vant/lib/tabs/style'
    import 'vant/lib/image/style'
    import 'vant/lib/button/style'
    import 'vant/lib/dialog/style'
    import 'vant/lib/toast/style'
    Vue.use(Tab).use(Tabs).use(Image).use(Button).use(Toast);
    export default{
        created(){
            if(this.isLogin){
                this.$store.commit('render/IsHome',false);
            }
            this.active=this.$route.query.index||0;
            console.log(this.active)
        },
        mounted(){
                myApi.get(`/getOrder?id=${this.userId}`).then(res=>{
                    this.allOrder=res;
                    this.allOrder.forEach((v)=>{
                        v.time=this.timeTransfrom(v.time);
                        v.ShopContent.forEach(val=>{
                            this.allQuantity+=(+val.quantity);
                            this.totalPrice+= (+val.price*+val.quantity);
                        })
                    })
                });
                this.notPayNum.forEach(v=>{
                    v.time=this.timeTransfrom(v.time);
                });
                this.payNum.forEach(v=>{
                v.time=this.timeTransfrom(v.time);
            })
        },
        data(){
          return{
              active:0,
              title:['全部','未付款','已付款'],
              allOrder:[],
              ShopContent:[],
              allQuantity:0,
              totalPrice:0,

          }
        },
        methods:{
            activeChange(){

            },
         timeTransfrom(time) {
            let date = new Date(time);
           let Month=date.getMonth()+1<10?`0${date.getMonth()+1}`:date.getMonth()+1;
           let Day=date.getDate()<10?`0${date.getDate()}`:date.getDate();
           let Hours=date.getHours()<10?`0${date.getHours()}`:date.getHours();
           let Minutes=date.getMinutes()<10?`0${date.getMinutes()}`:date.getMinutes();
           let Seconds=date.getSeconds()<10?`0${date.getSeconds()}`:date.getSeconds();
          return `${date.getFullYear()}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`;
         }
        },
        computed:{
            ...mapState("userMs",['isLogin','userId','notPayNum','payNum']),
        },
        components:{
            backNav,
            noneMessage,
            orderMessage
        }
    }
</script>
<style lang="scss" scoped>
    .OrderContent{
        padding-top: 50px;
        .OrderAll{
            .item{
                .time{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    .left{
                        display: flex;
                        flex-direction: column;
                    }
                }

            }
        }
    }
    .bgWhite{
        background-color: white;
    }
    .marginTop{
        margin-top: 15px;
    }
    .paddingInside{
        padding: 15px 0;
    }
    .padding{
        padding: 0 15px;
    }
    .paddingText{
        padding: 15px 15px;
    }
    .fontPaddingTop{
     padding-top: 5px;
    }
    .marginLeftFont{
        margin-left: 5px;
    }
    .border{
        position: relative;
    }
    .border:after{
        position: absolute;
        content:'';
        bottom: 5px;
        height: 1px;
        width: 100%;
        background-color: #e5e5e5;
    }
    .normalFont{
        font-size: 14px;
    }
    .miniFont{
        font-size: 12px;

    }
    .nanoFont{
        font-size: 10px;
    }
    .notImportant{
        color: #c6c6c6;
    }
    .row{
        display: flex;
        flex-direction: row;
    }
    .errState{
        color: red;
    }
    .successState{
        color: green;
    }
    .AlignCenter{
        align-items: center;
    }
    .flexEnd{
        justify-content: flex-end;
    }
</style>