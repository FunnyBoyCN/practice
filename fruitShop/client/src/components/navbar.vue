<template>
    <div>
        <transition name="slide" appear>
            <div class="navBar" :class="isFixed?'fixed':''">
                <div class="navBarLeft" @click="go(-1)">
                    <van-icon name="arrow-left" color="white"/>
                    <span class="marginFontLeft">返回</span>
                </div>
                <span class="navBarText">{{navbarTitle}}</span>
            </div>
        </transition>
        <div class="cover" ></div>
    </div>
</template>
<script>
    import {Icon} from 'vant'
    import Vue from 'vue'
    Vue.use(Icon)
    export default{
        data(){
            return{
              isFixed:false
            }
        },
        props:['navbarTitle','isRight','RightText'],
        methods:{
            go(){
                this.$router.go(-1)
            }
        },
        mounted(){
            window.addEventListener('scroll', ()=>{
                const scrollTop=window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
                 if(scrollTop>=15){
                     this.isFixed=true;
                 }else {
                     this.isFixed=false;
                 }
            })
        }
    }
</script>
<style lang="scss" scoped>
    .navBar{
        background-color:$main-color;
        height: 46PX;
        z-index: 10;
        position: fixed;
        top: 0;
        width: 100%;
        display: flex;
        flex-direction:  row;
        justify-content: center;
        align-items: center;
        .navBarLeft{
            position: absolute;
            left: 0;
            height: 100%;
            width: 65PX;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: white;
            .van-nav-bar__text{
                color: white;
            }
        }
        .navBarText{
            margin: 0 auto;
            color: white;
            font-weight: bold;
        }
    }
    .fixed{
        position: fixed;
        top:0;
        width: 100%;
    }
    .cover{
        width: 100%;
        height: 46PX;
        background-color:white;
    }
    .slide-enter-active{
        transform: translateY(-46px);
        @include slideUp(-46px);
    }
    .slide-leave-active{
        transform: translateY(0);
        @include slideDown(-46px);
    }
</style>