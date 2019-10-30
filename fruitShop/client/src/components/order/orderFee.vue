<template>
    <div class="orderFee  border">
        <div class="item flex row spaceBetween" >
            <span>商品金额</span>
            <div >
                <price-view :big="14" :small="14" :text="goodsPrice" :isEnd="true" :beforeSize="14" class="goodsPrice"/>
            </div>
        </div>
        <div class="item flex row spaceBetween" >
            <span>包装费</span>
            <div class="plus">
                <price-view :big="14" :small="14" :text="packFee" :isEnd="true" :beforeSize="14" class="goodsPrice"/>
            </div>
        </div>
        <div class="item flex row spaceBetween" >
            <span>运费</span>
            <div class="plus">
                <price-view :big="14" :small="14" :text="freight" :isEnd="true" :beforeSize="14" class="goodsPrice"/>
            </div>
        </div>
    </div>
</template>
<script>
    import priceView from '../realPrice.vue'
    export default{
        components:{
            priceView
        },
        props:{
            goodsPrice:{
                type:String,
                default:'0.00'
            },
            freight:{
                type:String,
                default:'0.00'
            },
            packFee:{
                type:String,
                default:'0.00',
            }
        }
    }
</script>
<style lang="scss" scoped>
    .border:after{
        position: absolute;
        @include transformX(-10px);
        width: 375px;
    }
    .orderFee{
        padding-top: 10px;
        padding-bottom: 10px;
        .item{
            font-size: 14px;
            padding-top: 10px;
            .plus{
                position: relative;
            }
            .plus:before{
                position: absolute;
                content: '+';
                left: -15px;
                font-size: 14px;
            }
        }
    }
</style>