<template>
    <div>
        <van-nav-bar :title="title"  left-arrow  @click-left="backNav"  class="BackNav" fixed :border="true" >
            <div slot="left" class="left">
                <van-icon name="arrow-left"  size="1.5rem" color="gray"/>
                返回
            </div>
        </van-nav-bar>
    </div>
</template>
<script>
import { NavBar } from 'vant';
import Vue from 'vue'
import 'vant/lib/nav-bar/style'
Vue.use(NavBar);
export default{
    data(){
        return{

        }
    },
    props:['title'],
    methods:{
        backNav(){
            this.$router.go(-1);

        }
    }
}
</script>
<style lang="scss" scoped>
.BackNav{
    background-color: #f1f1f1;
    height: 50px;
    .left{
        color: black;
    }
}
</style>