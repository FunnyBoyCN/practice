<template>
    <div class="priceCom flex row">
        <price :big="bigFontSize" :small="smallFontSize" :text="realPrice" :color="color" :isEnd="true" :beforeSize="true"/>
        <deleted-price  class="marginLeft" :text="price" :fontSize="oldPriceSize" :color="deColor"/>
    </div>
</template>
<script>
    import deletedPrice from '../components/deletedPrice.vue'
    import price from '../components/realPrice.vue'
    export default{
        props:['color','deColor','bigFontSize','oldPriceSize','smallFontSize','realPrice','price'],
        components:{
            deletedPrice,
            price
        }
    }
</script>
<style lang="scss" scoped>
    .priceCom{
        align-items: flex-end;
        span{
            display: inline-block;
        }

    }
</style>