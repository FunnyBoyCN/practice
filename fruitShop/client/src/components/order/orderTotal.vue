<template>
    <div class="total paddingTB flex row flexEnd alignCenter border">
        <span>共 {{totalNum}} 件商品 总价：</span>
        <real-price :big="18" :small="14" :text="totalPrice" :isEnd="true" :beforeSize="18"/>
    </div>
</template>
<script>
    import realPrice from '../realPrice.vue'
    export default{
        props:['totalNum','totalPrice'],
        components:{
            realPrice
        }
    }
</script>
<style lang="scss" scoped>
    .border:after{
        position: absolute;
        @include transformX(-10px);
        width: 375px;
    }
    .total{
        font-size: 14px;
        .price:before{
            @include price;
        }
    }
</style>