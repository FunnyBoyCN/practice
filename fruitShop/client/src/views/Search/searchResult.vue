<template>
    <div>
        <div v-show="noResult">
            <img src="../../assets/noFruits.jpg" ref="noResultImg" >
        </div>
        <div class="result">
            <template v-for="item in goods">
                <div class="item border" @click.stop="isCollage(item)?toCollage(item._id):toGoods(item._id)">
                    <div class="img">
                        <img :src="isCollage(item)?item.goodsContent.goodsImg[0]:item.goodsImg[0]" />
                    </div>
                    <div class="goodsMs">
                        <div>
                            <div class="name">{{isCollage(item)?item.goodsContent.name:item.name}}</div>
                            <div class="spec">{{isCollage(item)?item.goodsContent.spec:item.spec}}</div>
                        </div>
                        <div>
                            <div class="collage" v-if="isCollage(item)">
                                <div class="mode">{{item.mode}}人团</div>
                                <div class="groups">已团{{item.groups}}件</div>
                            </div>
                            <price class="price" :realPrice="isCollage(item)?item.Price:item.realPrice" :price="isCollage(item)?item.goodsContent.price:item.price" :color="'#ed9400'" :deColor="'#7a7a7a'" :oldPriceSize="12"/>
                        </div>
                        <goods-control class="goodsControl" :item="item" v-if="!isCollage(item)"/>
                        <div  class="goCollage " v-if="isCollage(item)" @click.stop="toCollage(item._id)">
                            去拼团
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import price from '../../components/price.vue'
    import goodsControl from '../../components/goodsControl.vue'
    export default{
        data(){
            return{
                goods:[],
                noResult:false

            }
        },
        components:{
            price,
            goodsControl
        },
        computed:{
            isCollage(){
                return function (item) {
                    return item.name=='collage'
                }
            }
        },
        methods:{
          noResultImg(){
              const documentWidth=document.documentElement.clientWidth;
              const ratio=this.$refs.noResultImg.width/this.$refs.noResultImg.height;
              let height=documentWidth/ratio;
              this.$refs.noResultImg.style.width=documentWidth+'px';
              this.$refs.noResultImg.style.height=height+'px';
          },
           init(){
               this.noResultImg();
               this.goods=this.$parent.goods;
               if(this.goods.length==0){
                   this.noResult=true;
               }else {
                   this.noResult=false;
               }
           },
            toCollage(id){
                this.$router.push({
                    path:'/Collage/detail',
                    query:{
                        id:id
                    }
                })
            },
            toGoods(id){
                this.$router.push({
                    path:'/goodsDetail',
                    query:{
                        id:id,
                    }
                })
            }
        },
        mounted(){
           this.init();
        }
    }
</script>
<style lang="scss" scoped>
    .result{
        padding-bottom: 57px;
        .item{
            padding:10px 10px;
            width: 355px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .img{
                width: 120px;
                height: 120px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                img{
                    max-width: 100%;
                    max-height: 100%;
                    width: auto;
                    height: auto;
                }
            }
            .goodsMs{
                width: 225px;
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                position: relative;
                .name{
                    @include LongtextHidden;
                    font-weight: bold;
                    font-size: 14px;
                }
                .spec{
                    font-size: 12px;
                    color: $text-color;
                }
                .collage{
                    display: flex;
                    flex-direction: row;
                    .mode{
                        @include radius(10px 0 10px 0);
                        background-color: #ed9400;
                        padding:1px 5px;
                        color: white;
                        font-size: 12px;
                    }
                    .groups{
                        font-size: 12px;
                        color: $text-color;
                        margin-left: 5px;
                    }
                }
                .price{
                    margin-top: 5px;
                }
                .goodsControl{
                    position: absolute;
                    right: 0;
                    bottom:0;
                    width: 120px;
                }
                .goCollage{
                    position: absolute;
                    right: 0;
                    bottom:10px;
                    padding:5px 15px;
                    background-color: $main-color;
                    @include radius(15px);
                    color: white;
                    font-size: 12px;
                }
            }
        }
    }
</style>