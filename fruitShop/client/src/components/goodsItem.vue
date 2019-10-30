<template>
    <div >
        <div class="goodsItem paddingTB flex row alignCenter border padding"  v-for="(item,index) in goodsItem" :key="index" @click="toDetail(item._id)">
            <div class="goodsImg" >
                <van-image
                        :src="item.goodsImg[0]"
                        fit="cover"
                        height="21.33vw"
                        width="21.33vw"
                />
            </div>
            <div class="goodsMs marginLeft flex column" >
                <div class="goodsMsTOP">
                    <div class="goodsName">{{item.name}}</div>
                    <div class="goodsDS flex row marginFontTop  alignCenter">
                        <div class="goodsSpec FontMini gray">{{item.spec}}</div>
                        <span class="goodsReserve error FontNano" v-if="item.reserve<5&&item.reserve!==0">仅剩{{item.reserve}}件</span>
                    </div>
                </div>
                <div class="goodsMsBottom flex row alignCenter spaceBetween">
                    <div class="goodsPrice flex row alignCenter">
                        <div class="realPrice orange FontNormal">￥{{item.realPrice}}</div>
                        <del class="price FontMini marginFontLeft">￥{{item.price}}</del>
                    </div>
                    <control :item="item"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import control from './goodsControl.vue'
    import {Image} from 'vant'
    import Vue from 'vue'
    Vue.use(Image)
    export default{
        methods:{
            toDetail(id){
              this.$router.push({
                  path:'/goodsDetail',
                  query:{
                      id:id,
                  }
              })
            }
        },
        props:['goodsItem'],
        components:{
            control
        }
    }
</script>
<style lang="scss" scoped>
    .van-skeleton{
        padding: 0;
    }
    .goodsItem{
        height: 100%;
        width: auto;
        .goodsMs{      //商品信息
            position: relative;
            height: 120px;
            width: 100%;
            justify-content: space-around;
            .goodsName{
                max-width: 180px;
                @include LongtextHidden
            }  //商品名字
            .goodsSpec{   //商品规格
                width: 120px;
                @include LongtextHidden;
                .goodsReserve{

                }
            }
        }
    }
    .border::after{
        width: 100%;
    }
</style>