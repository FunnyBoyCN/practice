<template>
    <div class="stateView  alignCenter ">
        <div class="pending flex row padding  alignCenter spaceBetween" v-if="state==0">
            <div class="flex row alignCenter">
                <van-icon name="clock-o" color="white" size="18px"/>
                <span class="marginLeft">待付款</span>
            </div>
            <span class="viewRight">付款剩余时间：<count-time-view class="countTime" :stopTime="stopTime"/></span>
        </div>
        <div class="state" v-if="state!==0">
            <order-step :state="state"/>
        </div>
    </div>
</template>
<script>
    import {Icon} from 'vant'
    import Vue from 'vue'
    import orderStep from '../../components/order/step.vue'
    import countTimeView from '../../components/orderDetail/countTime.vue'
    Vue.use(Icon);
    export default{
         props:{
             state:{
                 type:Number
             },
             createdTime:{
                 type:Number,
             }
         },
        components:{
            orderStep,
            countTimeView
        },
        data(){
             return{
               stopTime:0,
               countTime:``,
               startTime:0,
               timer:'',
             }
        },
        watch:{
            createdTime(val,oldval){
                if(val!==oldval){
                    this.startTime=this.createdTime;
                    this.checkOverTime();
                }
            }
        },
        methods:{
             checkOverTime(){
                 if(this.state==0){
                     const NowTime=Date.now();
                     const isOver=NowTime-this.startTime;
                     if(isOver<(1000*60*15)){
                         this.stopTime=(1000*60*15)-isOver;
                     }
                 }
             }
        }
    }
</script>
<style lang="scss" scoped>
     .stateView{
         height: 60PX;
         color: white;
         font-size: 14px;
         .pending{
             background-color: #ed9400;
             div{
                 height: 40px;
             }
             .viewRight{
                 display: flex;
                 flex-direction: row;
                 justify-content:center;
                 align-items: center;
             }
         }
         .state{
             display: flex;
             flex-direction: row;
             align-items: center;
             justify-content: center;
         }
     }

</style>