<template>
    <div class="networkErrorView" >
        <button class="reload" @click.stop="reload">
            <van-icon name="replay" size="16px" class="icon" color="#1989fa"/>
            <span>重新加载</span>
        </button>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Icon} from 'vant'
    Vue.use(Icon);
    export default{
        methods:{
            reload(){
                this.$router.go(-1);
            }
        },

    }
</script>
<style lang="scss" scoped>
     .networkErrorView{
         position: fixed;
         top:0;
         width: 100vw;
         height: 100vh;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         background-color: white;
         z-index: 999;
         .reload{
             display: flex;
             flex-direction: row;
             align-items: center;
             padding:10px 10px;
             color: #1989fa;
             @include reloadButton;
             @include radius(8px);
             border: 1px solid $main-color;
             .icon{
                 margin-right: 5px;
             }
         }
     }
</style>
