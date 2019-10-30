<template>
    <div>
        <van-tabbar
                active-color="#FF6700"
                inactive-color="#7d7e80"
                fixed
                :route="true"
                :safe-area-inset-bottom="true"
        >
            <van-tabbar-item
            to="/"
            >
                <span>主页</span>
                <van-icon name="wap-home" slot="icon"/>
            </van-tabbar-item>
            <van-tabbar-item
                    to="/classify"
            >
                <span>分类</span>
                <van-icon name="orders-o" slot="icon" />
            </van-tabbar-item>
            <van-tabbar-item :info="shopNum" to="/shopCar">
                <span>购物车</span>
                <van-icon name="shopping-cart-o" slot="icon" />
            </van-tabbar-item>
            <van-tabbar-item
                    to="/mine"
            >
                <span>我的</span>
                <van-icon name="manager-o" slot="icon"/>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
 import Vue from 'vue'
 import {Tabbar, TabbarItem,Icon } from 'vant';
 Vue.use(Tabbar).use(TabbarItem).use(Icon);
 import {mapState} from 'vuex'
 import 'vant/lib/tabbar/style';
 import 'vant/lib/tabbar-item/style';
 import 'vant/lib/icon/style';
   export default{
       created(){

       },
       computed:{
           ...mapState("userMs",['ShopCartNum']),
           shopNum(){
              return this.ShopCartNum===0?'':this.ShopCartNum;
           }
       },
       data(){
           return{

           }
       },
       watch:{
           selected:function () {

           }
       },
       methods:{
           change(res){

           }
       }
   }
</script>
<style>


</style>