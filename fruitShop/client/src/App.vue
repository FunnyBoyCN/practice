<template>
    <div>
        <div id="app">
            <router-view class="view" v-if="isRouterAlive" />
            <transition name="fade" appear >
                <tabbar class="tabbar" v-show="!isHidden"/>
            </transition>
            <carts v-if="show"/>
        </div>
    </div>
</template>
<script>
  import tabbar from './components/tabbar.vue'
  import carts from './components/carts.vue'
  import {mapState} from 'vuex'
  export default{
      data(){
        return{
            isRouterAlive:true,
        }
      },
      provide(){
         return{
             reload:this.reload
         }
      },
      components:{
          tabbar,
          carts,
      },
      computed:{
          ...mapState('tabbar',['isHidden']),
          ...mapState('carts',['show'])
      },
      methods:{
          reload(){
              this.isRouterAlive=false;
              this.$nextTick(function () {
                  this.isRouterAlive=true;
              })
          }
      }
  }
</script>
<style lang="scss">
    $main-color:#19A251;
    html,body{
        margin: 0;
        padding: 0;
        scroll-behavior:smooth;
}
    .tabbar{
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 10;
    }
    .fade-enter,.fade-leave-to{
        opacity: 0;
        transform: translateY(50px);
    }
    .fade-enter-active,.fade-leave-active{
        transition: all 0.3s linear;
    }
    .fade-enter-to,.fade-leave{
        transform: translateY(0px);
        opacity: 1;
    }
#app::-webkit-scrollbar { display:none !important }
    .paddingTB{
        padding-top:10px;
        padding-bottom: 10px;
    }
    .paddingFontTB{
        padding-top:5px;
        padding-bottom: 5px;
    }
    .padding{
        padding: 10px 10px;
    }
    .paddingFontLR{
        padding-left: 10px;
        padding-right: 10px;
    }
    .paddingXLR{
        padding-left: 15px;
        padding-right: 15px;
    }
    .paddingLR{
        padding-left: 10px;
        padding-right: 10px;
    }
    .paddingFontTop{
        padding-top: 5px;
    }
    .paddingLeft{
        padding-left: 10px;
    }
    .paddingTop{
        padding-top: 10px;
    }
    .paddingBottom{
        padding-bottom: 10px;
    }
    .marginLR{
        margin-left:10px ;
        margin-right:10px ;
    }
    .marginFontTop{
        margin-top: 5px;
    }
    .marginLeft{
        margin-left: 10px;
    }
    .marginTop{
        margin-top: 10px;
    }
    .marginFontLeft{
        margin-left: 5px;
    }
    .marginFontRight{
        margin-right: 10px;
    }
    /*layout*/
    .flex{
        display: flex;
    }
    .row{
        flex-direction: row;
    }
    .column{
        flex-direction: column;
    }
    .justCenter{
        justify-content: center;
    }
    .alignCenter{
        align-items: center;
    }
    .flexEnd{
        justify-content: flex-end;
    }
    .alignEnd{
        align-items: flex-end;
    }
    .spaceAround{
        justify-content: space-around;
    }
    .spaceBetween{
        justify-content: space-between;
    }
    .floatL{
        float: left;
    }
    .floatR{
        float: right;
    }
    .positionAB{
        position: absolute;
    }
    .top{
        top:0;
    }
    /*color*/
    .error{
        color: red;
    }
    .orange{
       color: orange;
    }
    .gray{
        color: gray;
    }
    .white{
        color: white;
    }
    .lightGray{
        color: gainsboro;
    }
    /*bgColor*/
    .bgWhite{
        background-color: white;
    }
    .mainColor{
        background-color: #19A251;
    }
    .bgGray{
        background-color: #d9d9d9;
    }
    .bgLightGray{
        background-color:rgba(0,0,0,0.1) ;
    }
    /*font*/
    .FontNano{
        font-size: 8px;
    }
    .Fontmini{
        font-size: 10px;
    }
    .FontMini{
        font-size: 12px;
    }
    .FontNormal{
        font-size: 14px;
    }
    .FontLarge{
        font-size: 16px;
    }
    .FontWeight{
        font-weight: bold;
    }

.border{
    position: relative;
}
.border::after{
    position: absolute;
    content:'';
    bottom: 0;
    left: 0;
    background-color: gainsboro;
    width: 100%;
    height: 1px;
}
</style>
