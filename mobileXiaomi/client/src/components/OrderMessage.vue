<template>
    <div>
    <div class="OrderAll  marginTop padding bgWhite"  v-for="(item,index) in data" :key="index" v-if="data.length>0">
        <div class="item">
            <div class="time paddingInside border">
                <div class="left">
                    <div class="orderTime normalFont row">
                        <div>订单日期:</div>
                        <span class="marginLeftFont">{{item.time}}</span>
                    </div>
                    <div class="orderNumber miniFont row fontPaddingTop notImportant">
                        <div>订单编号:</div>
                        <span class="marginLeftFont ">{{item.Order}}</span>
                    </div>
                </div>
                <div class="right" >
                    <span :class="item.state==0?'errState':'successState'">{{item.state==0?'未付款':'已付款'}}</span>
                </div>
            </div>
            <template v-if="item.ShopContent">
                <div class="border" >
                    <div class=" paddingInside row AlignCenter" v-for="(v,k) in item.ShopContent">
                        <van-image
                                width="50"
                                height="50"
                                :src="v.imgs[0]"
                        />
                        <div class="decText normalFont marginLeftFont">{{v.name}} X{{v.quantity}}</div>
                    </div>
                </div>
            </template>
            <div  class="flexEnd row AlignCenter paddingInside">
                <van-button  size="small" :type="'default'" @click="goDetail(item.Order,item.time)">查看详情</van-button>
                <van-button  class="marginLeftFont" v-if="item.state==0" size="small" :type="'danger'" @click="goPay(item._id,item.state)">去付款</van-button>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
    import {Image,Button,Dialog,Toast} from 'vant'
    import {myApi} from '../utils/myApi'
    import {mapState} from 'vuex'
    import Vue from 'vue'
    import 'vant/lib/image/style'
    import 'vant/lib/button/style'
    import 'vant/lib/dialog/style'
    import 'vant/lib/toast/style'
    Vue.use(Image).use(Button).use(Toast);
    export default{
        data(){
            return{

            }
        },
        computed:{
            ...mapState('userMs',['userId'])
        },
        props:['data'],
        methods:{
            goPay(id,state){
                if(state===0){
                    Dialog.confirm({
                        title: '是否支付',
                        confirmButtonText:'是',
                        cancelButtonText:'否',
                        confirmButtonColor:'#ff6700'
                    }).then(() => {
                        myApi.post('/UpdateOrder',{Orderid:id}).then((res)=>{
                           this.$router.go(0);
                            Toast.success({
                                message:res
                            })
                        })
                    }).catch(() => {

                    });

                }else {

                }
            },
            goDetail(id,time){
                  this.$router.push({path:'/OrderDetail',query:{
                      id:id,
                      time:time,
                  }})
            },

        }
    }
</script>
<style lang="scss" scoped>
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
    .errState{
        color: red;
    }
    .successState{
        color: green;
    }
    .miniFont{
        font-size: 12px;

    }
    .marginLeftFont{
        margin-left: 5px;
    }
    .AlignCenter{
        align-items: center;
    }
    .fontPaddingTop{
        padding-top: 5px;
    }
    .notImportant{
        color: #c6c6c6;
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
    .row{
        display: flex;
        flex-direction: row;
    }
    .flexEnd{
        justify-content: flex-end;
    }
</style>