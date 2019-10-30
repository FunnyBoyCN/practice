<template>
  <div id="app">
    <router-view v-show="!LoadingState">
    </router-view>
    <div  v-show="LoadingState" class="bgLoading">
      <van-loading  color="#ff6700" size="35px" >加载中....</van-loading>
    </div>
    <tabbar v-if="isHome"></tabbar>
  </div>
</template>
<script>
  import tabbar from './components/tabbar.vue'
  import {mapState} from 'vuex'
  import {Loading} from 'vant'
  import Vue from  'vue'
  import 'vant/lib/loading/style'
  Vue.use(Loading)
  export default{
      components:{
          tabbar,

      },
      computed:{
          ...mapState("render",['isHome']),
          ...mapState("loading",['LoadingState'])
      }
  }
</script>
<style lang="scss">
html,body{
margin: 0;
  padding: 0;
  scroll-behavior:smooth;
  background-color: #f1f1f1;;
}
  .bgLoading{
    height: 100vh;
    width: 100vw;
    position: absolute;
    top:0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
  }
</style>
