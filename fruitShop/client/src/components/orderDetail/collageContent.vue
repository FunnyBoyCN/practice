<template>
    <div class="collageContent paddingTB flex row alignCenter border">
        <van-image
                width="130"
                height="130"
                :src="collage.goods.goodsImg[0]"
                class="image"
                fit="cover"
        />
        <div class="collageMs marginLeft flex column spaceBetween ">
            <div class="collageName">{{collage.goods.name}}  {{collage.goods.desc}}</div>
            <div class="collageSpec">{{collage.goods.spec}}</div>
            <div v-if="isCheckOut" class="collageMode">
                {{collage.mode}}人团
            </div>
            <price-view
                    :color="isCheckOut?'#ed9400':'black'"
                    :bigFontSize="22"
                    :smallFontSize="18"
                    :oldPriceSize="12"
                    :realPrice="collage.price"
                    :price="collage.goods.realPrice"
            />
            <div class="collageNum " v-if="isDetail">数量: x1</div>
        </div>
    </div>
</template>
<script>
    import priceView from '../../components/price.vue'
    import {Image} from 'vant'
    import Vue from 'vue'
    Vue.use(Image);
    export default{
        components:{
            priceView
        },
        data(){
            return{
            }
        },
        props:{
            imageUrl:{

            },
            isDetail:{
                type:Boolean
            },
            isCheckOut:{
                type:Boolean,
                default:false
            },
            collage:{
                type:Object
            }
        },
    }
</script>
<style lang="scss" scoped>
    .collageContent{
        background-color: white;
        .image{
            width: 130px;
            height: 130px;
        }
        .collageMs{
            width: 215px;
            height: 130px;
            position: relative;
            .collageSpec{
                font-size: 12px;
                color: $text-color;
            }
            .collageMode{
                padding:2PX 2PX;
                color: #ed9400;
                text-align: center;
                border: 1px solid #ed9400;
                @include radius(15px);
                font-size: 12px;
                display: block;
                width: 45px;
            }
            .collageNum{
                position: absolute;
                bottom: 0;
                right: 0;
                font-size: 12px;
                color: $text-color;
            }
        }

    }
</style>