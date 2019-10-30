<template>
    <div class="stateView" :class="state==-1||state==3?'cancelView':''">
         <div class="stateArea">
             <van-icon name="clock-o" size="20px" color="white" v-if="state>-1&&state<3"/>
             <span class="text">{{stateText(state)}}</span>
         </div>
        <div class="rightView">
            <div class="orderMode" :class="[state==2?'allPay':'',state==-1||state==3?'cancelMode':'']" >
                <span class="mode">{{mode}}人团</span>
                <span class="lessMode" v-if="state>=0&&state<=1">还差{{lessPeople}}人</span>
            </div>
            <div class="countTimeView" v-if="state==1||state==0">
                <span v-if="state==1">组团还剩</span>
                <span v-if="state==0">订单支付还剩</span>
                <van-count-down :time="stopTime" class="countTime" :auto-start="autoPlay"  @finish="finished">
                    <template v-slot="timeData">
                        <span class="item" v-if="state==1">{{ timeData.hours<10?`0${timeData.hours}`: timeData.hours }}:</span>
                        <span class="item">{{ timeData.minutes<10?`0${timeData.minutes}`: timeData.minutes}}:</span>
                        <span class="item">{{ timeData.seconds<10?`0${timeData.seconds}`: timeData.seconds }}</span>
                    </template>
                </van-count-down>
            </div>
        </div>
        <!--美化界面-->
        <svg class="editorial"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink"
             viewBox="0 24 150 28"
             preserveAspectRatio="none"
             v-if="state>-1&&state<3"
        >
            <defs>
                <path id="gentle-wave"
                      d="M-100 44c30 0
                            58-18 88-18s
                            58 18 88 18
                            58-18 88-18
                            58 18 88 18
                            v44h-352z" />
            </defs>
            <g class="parallax">
                <use xlink:href="#gentle-wave" x="50" y="8" fill="rgba(255,255,255,0.20)"/>
                <use xlink:href="#gentle-wave" x="100" y="8" fill="rgba(255,255,255,0.25)"/>
                <use xlink:href="#gentle-wave" x="150" y="8" fill="rgba(255,255,255,0.15)"/>
            </g>
        </svg>
    </div>
</template>
<script>
    import {Icon,CountDown} from 'vant'
    import {mapState} from 'vuex'
    import Vue from 'vue'
    Vue.use(Icon).use(CountDown)
   export default{
      data(){
          return{
              stopTime:80000,
              createdTime:0,
              payTime:0,
              state:0,
              allPay:false,
              isReload:false,
              autoPlay:false,
              lessPeople:0,
              mode:0
          }
      },
       inject:['reload'],
       methods:{
           finished(){
               this.reload();
           },
           stateTimeCalc(timeLong,timeType){
               const nowTime=Date.now();
               const isOver=nowTime-timeType;
               if(isOver<timeLong){
                   this.stopTime=timeLong-isOver;
                   this.autoPlay=true;
               }else{
                   this.stopTime=0;
                   this.autoPlay=false;
               }
           }
       },
       props:['collageOrderDetail'],
       computed:{
           stateText(){
               return function (state) {
                   let text;
                   switch (state){
                       case -1:{
                           text= '已取消';
                           break;
                       }
                       case 0:{
                           text= '待付款';
                           break;
                       }
                       case 1:{
                           text= '待成团';
                           break;
                       }
                       case 2:{
                           text= '待提货';
                           break;
                       }
                       case 3:{
                           text= '已提货';
                           break;
                       }
                   }
                   return text;
               }
           }
       },
       watch:{
           collageOrderDetail(val,oldVal){
               if(val!==oldVal){
                   this.state=val.state;
                   this.mode=val.mode;
                   this.lessPeople=val.mode-val.joinPeople.length;
                   if(this.state==0||this.state==1){
                       this.createdTime=new Date((val.createdTime).toString().replace(/-/g,'/')).getTime();
                       this.payTime=val.createdPayTime;
                       if(this.state==0){
                           this.stateTimeCalc((1000*60*15),this.createdTime);
                       }else if(this.state==1){
                           this.stateTimeCalc((1000*60*60*24),this.payTime);
                       }
                   }
               }
           }
       }
   }
</script>
<style lang="scss" scoped>
     .stateView{
         position: relative;
         width: 355px;
         height: 60px;
         padding:10px 10px;
         background-color: #ed9400;
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         align-items: center;
         color: white;
         .stateArea{
             display: flex;
             flex-direction: row;
             justify-content: center;
             align-items: center;
             .text{
                 margin-left: 5px;
                 font-size: 16px;
             }
         }
         .rightView{
             height: 100%;
             display: flex;
             flex-direction: column;
             justify-content: center;
             align-items: center;
             .orderMode{
                 border: 1px solid white;
                 @include radius(12px);
                 font-size: 14px;
                 width:110px;
                 overflow: hidden;
                 display: flex;
                 flex-direction: row;
                 align-items: center;
                 .mode{
                     background-color: #ed9400;
                     color: white;
                     width: 45%;
                     height: 100%;
                     display: flex;
                     flex-direction: column;
                     align-items: center;
                     justify-content: center;
                 }
                 .lessMode{
                     background-color: white;
                     color: #ed9400;
                     width: 55%;
                     height: 100%;
                     display: flex;
                     flex-direction: column;
                     align-items: center;
                     justify-content: center;
                 }
             }
             .allPay{
                 display: flex;
                 flex-direction: row;
                 justify-content: center;
                 align-items: center;
                 width: 55px;
                 background-color: #ed9400;
                 .mode{
                     width: auto;
                     padding: 0;
                 }
             }
             .cancelMode{
                 display: flex;
                 flex-direction: row;
                 justify-content: center;
                 align-items: center;
                 width: 55px;
                 background-color: white;
                 border: 1px solid #ed9400;
                 .mode{
                     width: auto;
                     padding: 0;
                     background-color: white;
                     color: #ed9400;
                 }
             }
             .countTimeView{
                 align-self: flex-end;
                 margin-top: 10px;
                 font-size: 14px;
                 color: white;
                 display: flex;
                 flex-direction: row;
                 .countTime{
                     margin-left: 5px;
                     .item{
                         color: white;
                     }
                 }
             }
         }
        .editorial{
            position: absolute;
            bottom: 0;
            left: 0;

        }
     }
    .cancelView{
        height: 30px;
        background-color: white;
        color: #ed9400;
        .stateArea{
            .text{
                font-size: 14px;
            }
        }
    }
</style>