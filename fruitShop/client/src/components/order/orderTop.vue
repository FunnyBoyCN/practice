<template>
        <div class="topMs flex row spaceBetween alignCenter">
            <div class="time  border flex row alignCenter">
                <van-icon :name="icon" size="4vw" color="#7a7a7a"/>
                <span class=" marginFontLeft">{{orderTime}}</span>
            </div>
            <span class="state" :class="stateClass(state)">{{stateText(state)}}</span>
        </div>
</template>
<script>
    import Vue from 'vue'
    import {Icon} from 'vant'
    Vue.use(Icon)
    export default{
        data(){
            return{

            }
        },
        props:['icon','state','orderTime'],
        computed:{
            stateText(){
                return function (state) {
                    let stateText;
                    switch (state){
                        case -1:{
                            stateText= `订单已取消`;
                            break;
                        }
                        case 0:{
                            stateText= `订单未付款`;
                            break;
                        }
                        case 1:{
                            stateText= `订单已付款`;
                            break;
                        }
                        case 2:{
                            stateText= `订单送货中`;
                            break;
                        }
                        case 3:{
                            stateText= `订单已收货`;
                            break;
                        }
                    }
                    return stateText;
                }
            },
            stateClass(){
                return function (state) {
                    let className;
                    switch (state){
                        case -1:{
                            className= `cancel`;
                            break;
                        }
                        case 0:{
                            className= `pending`;
                            break;
                        }
                        case 1:{
                            className= `done`;
                            break;
                        }
                        case 2:{
                            className= `done`;
                            break;
                        }
                        case 3:{
                            className= `done`;
                            break;
                        }
                    }
                    return className;
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .topMs{
        width: auto;
        .time{
            padding:10px 0;
            font-size: 14px;
            color: #7a7a7a  ;
        }
        .state{
            font-size: 14px;
            color: black;
        }
        .pending{
            color: #ed9400;
        }
        .done{
            color:$main-color;
        }
        .cancel{
            color:$main-color;
        }
    }
    .border:after{
        position: absolute;
        @include transformX(-10px);
        width: 375px;
    }
</style>