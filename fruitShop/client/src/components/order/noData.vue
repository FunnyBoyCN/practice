<template>
    <div class="noDataView" :style="{height:homeHeight+'px'}">
        <van-icon name="fail" size="48px" color="#7a7a7a" />
        <span class="warmingText" v-if="!isAddress">您还没有任何{{text}}订单</span>
        <span class="warmingText" v-if="isAddress">您还未设置任何收货地址</span>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Icon} from 'vant'
    Vue.use(Icon)
    export default {
        props:{
            text:{
                type:String,
            },
            isAddress:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                homeHeight:0
            }
        },
        mounted(){
            if(!this.isAddress){
                this.homeHeight=document.documentElement.clientHeight-140;
            }else {
                this.homeHeight=document.documentElement.clientHeight-96;
            }

        }
    }
</script>
<style lang="scss" scoped>
      .noDataView{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 375px;
          background-color: white;
          .warmingText{
              margin-top: 5px;
          }
      }
</style>