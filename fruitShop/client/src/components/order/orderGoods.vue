<template>
    <div>
        <div class="cartGoodsItem  flex row alignCenter spaceBetween border" v-for="(item,index) in merchandise">
            <van-image
                    width="20vw"
                    height="20vw"
                    fit="cover"
                    :src="item.goodsImg"
                    class="goodsImg"
            />
            <div class="goodsDetail  flex column spaceBetween">
                <div class="flex column">
                    <span class="name">{{item.name}} {{item.desc}}</span>
                    <span class="spec marginFontTop">{{item.spec}}</span>
                </div>
                <span class="num">数量:X{{item.num}}</span>
            </div>
            <price-view :big="18" :small="14" :text="item.price.toString()" :isEnd="true" class="goodsPrice"/>
        </div>
    </div>
</template>
<script>
    import priceView from '../realPrice.vue'
     export default{
        components:{
            priceView
        },
         mounted(){

         },
         props:['merchandise']
     }
</script>
<style lang="scss" scoped>
    .cartGoodsItem{
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: white;
        .goodsImg{
            min-width: 75px;
        }
        .goodsDetail{
            margin-left: 15px;
            height: 75px;
            min-width: 125px;
            .name{
                @include LongtextHidden;
            }
            .spec,.num{
                font-size: 12px;
                color: #7a7a7a;
            }
        }
        .goodsPrice{
            align-self: flex-end;
        }
    }
    .border:after{
        position: absolute;
        @include transformX(-10px);
        width: 375px;
    }
</style>