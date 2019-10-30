<template>
    <div>
        <van-overlay
                :show="true"
                :z-index="10"
        />
        <transition enterActiveClass="zoomIn " appear leaveActiveClass="zoomOut">
            <div class="fail animated faster">
                <van-icon name="cross" size="58px" color="rgba(0,0,0,0.5);"/>
                <span>支付失败</span>
            </div>
        </transition>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { Overlay,Icon } from 'vant';
    Vue.use(Overlay).use(Icon);
    export default{

    }
</script>
<style lang="scss" scoped>
     .fail{
         position: fixed;
         top: 50%;
         left: 50%;
         @include transformXY(-50%,-50%);
         width: 150px;
         height: 150px;
         background-color: $bg-color;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         opacity: 0.6;
         z-index: 11;
         span{
             color: rgba(0,0,0,0.5);
         }
     }
</style>