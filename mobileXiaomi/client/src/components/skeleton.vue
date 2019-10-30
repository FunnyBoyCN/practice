<template>
    <div>
        <van-skeleton title avatar :row="3" :loading="isShow" class="bgWhite paddingBottom"/>
    </div>
</template>
<script>
    import {Skeleton} from 'vant'
    import Vue from 'vue'
    import 'vant/lib/skeleton/style'
    Vue.use(Skeleton)
    export default{
        computed:{
            isShow(){
                if(this.data.length===0){
                    return true
                }else {
                    return false
                }
            }
        },
        props:['data']
    }
</script>
<style lang="scss" scoped>
    .bgWhite{
        background-color: white;
    }
    .paddingBottom{
        padding-bottom: 15px;
    }
</style>