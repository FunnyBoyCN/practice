<template>
   <div class="goodsControl flex row  padding alignCenter" :class="item.reserve==0?'justCenter':'spaceBetween'">
        <transition name="rotate">
        <div class="reduce flex justCenter alignCenter" v-if="item.reserve!==0" v-show="num(item._id)!==0" @click.stop="addGoods(-1,item)"></div>
        </transition>
        <transition name="rotate" >
        <div class="NumShow" v-show="num(item._id)!==0" v-if="item.reserve!==0">{{num(item._id)}}</div>
        </transition>
        <div class="plus flex justCenter alignCenter" v-if="item.reserve!==0" @click.stop="addGoods(+1,item)"><van-icon name="plus" size="12px"/></div>
       <div v-else class="noReserve">已售罄</div>
    </div>
</template>
<script>
    import {Toast} from 'vant'
    import Vue from 'vue'
    import {mapState} from 'vuex'
    Vue.use(Toast);
    export default{
        props:['item'],
        data(){
          return{
              isAdd:false
          }
        },
        methods:{
           async addGoods(num,item){
                const data={
                   _id:item._id,
                   num:num,
                   price:item.realPrice,
                   name:item.name,
                   reserve:item.reserve,
                   goodsImg:item.goodsImg[0],
                   desc:item.desc,
                   spec:item.spec
               };

               this.$store.dispatch('carts/addMerchandise',data);
            },
        },
        computed:{
            ...mapState('carts',['merchandise']),
            num(){
                return function(id){
                 const result=this.merchandise.find(v=>{
                       return v._id==id
                    });
                 if(result){
                     return result.num;
                 }else {
                     return 0
                 }
                }
            }

        }
    }
</script>
<style lang="scss" scoped>
    .goodsControl { //购买按钮
        max-width: 65px;
        height: 20px;
        position: relative;
        padding-right: 0;
        flex-grow: 1;
        font-size: 14px;
        .plus {
            position: absolute;
            right: 0;
            @include radius(50%);
            color: white;
            background-color: $main-color;
            height: 16px;
            width: 16px;
            font-size: 10px;
        }
        .NumShow {
            margin: 0 auto;
        }
        .reduce {
            position: absolute;
            left: 10px;
            @include radius(50%);
            color: $main-color;
            border: 1px solid gray;
            height: 14px;
            width: 14px;
            line-height: 14px;
            text-align: center;
        }
        .reduce::after {
            content: '';
            width: 8px;
            height: 1px;
            background-color: $main-color;
        }
    }
    .noReserve{
        font-size: 12px;
        color: $text-color;
    }
    .rotate-enter-active{
       animation: rotate-in 0.3s linear;
    }
    .rotate-leave-active{
        animation: rotate-out 0.3s linear;
    }
    .add-enter-active{
        animation:add-in 3s linear;
    }
    @keyframes rotate-in {
        0% {
            position: absolute;
            right: 0;
            transform: translateX(50px) rotateZ(0deg);
        }
        100% {
            transform: translateX(0px) rotateZ(540deg)
        }
    }
    @keyframes rotate-out {
        0% {
            transform: translateX(0px) rotateZ(540deg);
        }
        100% {
            position: absolute;
            right: 0;
            transform: translateX(50px) rotateZ(0deg)
        }
    }
    @keyframes add-in {
        0% {
            transform: translateX(0px);
        }
        100% {

            transform: translateX(-360px);
        }
    }
</style>