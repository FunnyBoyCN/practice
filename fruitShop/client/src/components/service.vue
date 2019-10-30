<template>
    <div >
        <div class="service flex row alignCenter  paddingLR" @click="toDetail" :class="isPaySuccess?'justCenter':'spaceBetween'">
            <div class="left flex row alignCenter spaceBetween">
                <div class="item flex row alignCenter" v-for="(item,index) in serviceContent" :key="index">
                    <div class="icon">
                        <van-icon name="success" size="9PX" color="#19A251"/>
                    </div>
                    <span>{{item.title}}</span>
                </div>
            </div>
            <van-icon class="arrow" name="arrow" size="4vw" color="#7A7A7A" v-if="!isPaySuccess"/>
        </div>
        <transition name="slide" appear>
            <div class="serviceContent" v-show="contentShow" @touchmove.prevent>
                <div class="title padding">千果汇服务说明</div>
                <div class="content paddingXLR border">
                    <div class="item flex row alignCenter" v-for="(item,index) in serviceContent" :key="index">
                        <i class="iconfont" :class="item.content.icon"></i>
                        <div class="text flex column marginLeft">
                            <span class="textTitle">{{item.content.textTitle}}</span>
                            <span class="textContent">{{item.content.textContent}}</span>
                        </div>
                    </div>
                </div>
                <button class="closeButton padding" @click="show=false;contentShow=false;">我知道了</button>
            </div>
        </transition>
        <van-overlay
            :show="show"
            @click="show=false;contentShow=false;"

    />
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Overlay,Icon} from  'vant'
    Vue.use(Overlay).use(Icon);
 export default{
     data(){
         return{
             show:false,
             contentShow:false,
             serviceContent:[
                 {
                     title:'三无退货',
                     content:{
                         icon:'icon-instantRefund',
                         textTitle:'不好吃瞬间退款',
                         textContent:'支持门店和App订单，不新鲜、不满意、不好吃、无理由，7天内瞬间退款'
                     }
                 },
                 {
                     title:'特约供货地',
                     content:{
                         icon:'icon-fly',
                         textTitle:'真正的新鲜货源',
                         textContent:'在全国拥有千家水果种植合作基地' +
                         '已逐步建立了完善的全国采购系统'
                     }
                 },
                 {
                     title:'品控质检',
                     content:{
                         icon:'icon-safe',
                         textTitle:'真正的安全放心',
                         textContent:'十大环节重重检验筛选，为安全把关' +
                         '以“四度一味一安全”自创果品标准体系，并得到中国果品流通协会的授权支持'
                     }
                 }
             ]
         }
     },
     props:{
         isPaySuccess:{
             type:Boolean,
             default:false
         }
     },
     methods:{
         toDetail(){
             this.show=true;
             this.contentShow=true;
         }
     },

 }
</script>
<style lang="scss" scoped>
    @font-face {
        font-family: 'iconfont';  /* project id 1353777 */
        src: url('//at.alicdn.com/t/font_1353777_8ar0rbqb4di.eot');
        src: url('//at.alicdn.com/t/font_1353777_8ar0rbqb4di.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1353777_8ar0rbqb4di.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1353777_8ar0rbqb4di.woff') format('woff'),
        url('//at.alicdn.com/t/font_1353777_8ar0rbqb4di.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1353777_8ar0rbqb4di.svg#iconfont') format('svg');
    }
    .iconfont {
        font-family: "iconfont" ;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-fly:before {
        content: "\e6a4";
        font-size: 36PX;
    }

    .icon-instantRefund:before {
        content: "\e617";
        font-size: 36PX;
    }

    .icon-safe:before {
        content: "\e6a3";
        font-size: 36PX;
    }
   .service{
       height: 50PX;
       background-color: white;
       .left{
           width: 85%;
           .item{
               span{
                   font-size: 12px;
                   color: $text-color;
                   margin-left: 5px;
               }
               .icon{
                   @include radius(50%);
                   width: 10PX;
                   height: 10PX;
                   background: white;
                   border: 1PX solid #19A251;
                   box-sizing: border-box;
                   -webkit-box-sizing:border-box ;
                   -moz-box-sizing: border-box;
                   position: relative;
                   .van-icon{
                       position: absolute;
                       top:50%;
                       left: 50%;
                       @include transformXY(-50%,-50%);
                       @include radius(50%);

                   }
               }
           }
       }

   }
   .serviceContent{
       position: fixed;
       bottom: 0;
       width: 100%;
       max-height: 355px;
       z-index: 3;
       .title{
           position: relative;
           height: 30PX;
           width: 355px;
           text-align: center;
           line-height: 30PX;
           background-color: $bg-color;
           font-size: 12PX;
           color: $text-color;
       }
       .title::before{
           position: absolute;
           content:' ';
           top:50%;
           left:75px;
           width: 55px;
           height: 1px;
           background-color: $text-color;
           @include transformY(-50%);

       }
       .title::after{
           position: absolute;
           content:' ';
           top:50%;
           right:75px;
           width: 55px;
           height: 1px;
           background-color: $text-color;
           @include transformY(-50%);
       }
       .content{
          background-color: white;
           padding-bottom: 10px;
           .item{
               padding-top: 15px;
               padding-bottom: 15px;
               i{
                   position: relative;
                   display: block;
                   width: 40px;
                   height: 40px;
                   color: #AFAFAF;
                   text-align: center;
               }
               .text{
                   .textTitle{
                       font-size: 14PX;
                       color: $main-color;
                   }
                   .textContent{
                       font-size: 12PX;
                       color: $text-color;
                   }
               }
           }
           .item:first-child{
               padding-top: 5px;
           }

       }
       .closeButton{
           background-color: white;
           @include reloadButton;
           width: 100%;
           color: $main-color;
           font-size: 18PX;
           font-weight: 400;
       }
    }
    .slide-enter-active{
        @include slideUp(355px);
    }
    .slide-leave-active{
        @include slideDown(355px);
    }

</style>