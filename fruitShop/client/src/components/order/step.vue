<template>
    <div class="stepView flex row ">
       <div class="item flex column alignCenter" :class="item.state" v-for="(item,index) in stepArray" :key="index">
           <div class="icon  flex row justCenter alignCenter">
               <van-icon :name="item.icon" size="10px" color="white"/>
           </div>
           <span class="stateText">{{item.text}}</span>
       </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {Icon } from 'vant';
    Vue.use(Icon);
    export default{
       data(){
           return{
               stepArray:[],
               active:0,
               realState:0,
               timeLyOrder:[{
                   icon:'pending-payment',
                   text:'待付款',
                   state:'',
               },{
                   icon:'paid',
                   text:'已付款',
                   state:'',
               },
                   {
                   icon:'logistics',
                   text:'送货中',
                    state:'',
                  },
                   {
                     icon:'completed',
                      text:'已收货',
                       state:'',
                   }
               ],
               cancelOrder:{
                   icon:'failure',
                   text:'已取消',
                   state:'',
               }
           }
       },
       methods:{
           changeState(){  //状态改变
               this.active=this.state?this.state:0;
               if(this.active==-1){
                   this.stepArray=this.timeLyOrder.slice(0,1);
                   this.stepArray.push(this.cancelOrder);
                   this.$set(this.stepArray[0],'state','active used')
                   this.$set(this.stepArray[this.stepArray.length-1],'state','active')
               }else {
                   this.$set(this.stepArray[this.active],'state','active')
                   for(let i=0;i<this.active;i++){
                       this.$set(this.stepArray[i],'state','active used')
                   }
               }
           }
       },
        mounted(){
           this.stepArray=this.timeLyOrder;
           this.changeState(); //初始化
        },
       watch:{
           active(){
               this.changeState();
           },
           state(val,oldval){
               if(val!==oldval){
                   this.state=val;
                   this.changeState();
               }
           }
       },
        props:['state']
    }
</script>
<style lang="scss">
    .stepView{
        padding:10px 0;
        background-color: white;
        .item{
            width: 50px;
            margin: 0 10px;
            .icon{
                position: relative;
                width: 20px;
                height: 20px;
                @include radius(50%);
                box-sizing: border-box;
                background-color: $line-color;
            }
            .icon:before{
                position: absolute;
                top:50%;
                left:-45px;
                content: '';
                background-color:  $line-color;
                @include transformY(-50%);
                width: 40px;
                height: 1px;
            }

            .stateText{
                margin-top: 5px;
                font-size: 12px;
                color: $text-color;
            }
        }
        .active>.icon{
            background-color: $main-color;
            border: 2px solid rgb(25, 205, 128);
        }
        .active>.icon:before{
            background-color: $main-color;
        }
        .active>.stateText{
            color: $main-color;
        }
        .used>.icon,.used>.stateText{
            opacity: 0.6;
        }
        .item:first-child{
            margin-left:0 ;
        }
        .item:first-child .icon:before{
            height: 0;

        }


    }

</style>