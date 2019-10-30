<template>
        <div class="othersCollageView" :class="order?'noPadding':''">
            <div class="top" v-show="collageGroups.length!=0">
                <span class="point"></span>
                <span class="text">大家都在拼</span>
                <span class="point"></span>
            </div>
            <div class="main" v-show="collageGroups.length!=0">
                <div class="item" v-for="(item,index) in collageGroups" :key="item._id">
                    <div class="content">
                        <template v-if="item.goods">
                            <van-image
                                    :src="item.goods.goodsImg[0]"
                                    width="120"
                                    height="120"
                                    fit="cover"
                                    class="image"
                            />
                            <span class="collageName">【{{item.goods.name}}&nbsp{{item.goods.desc}}】</span>
                            <div class="collagePrice flex row spaceAround">
                                <del>￥{{item.goods.realPrice}}</del>
                                <span class=" price">￥{{item.price.toFixed(2)}}</span>
                                <span class=" mode">{{item.mode}}人团</span>
                            </div>
                        </template>
                    </div>
                    <div class="control">
                        <span class="normal">已团<span class="success">{{item.joinPeople.length}}</span>/{{item.mode}}人</span>
                        <button class="toCollage">去参团</button>
                    </div>
                </div>
            </div>
            <div class="empty" v-show="collageGroups.length==0">
                <van-icon name="fail" class="icon" color="#E5E5E5"/>
                <span class="text">没有更多拼团</span>
            </div>
        </div>
</template>
<script>
    import {Image,Icon} from 'vant'
    import Vue from 'vue'
    Vue.use(Image).use(Icon);
    import {api} from '../../utils/api'
    export default{
        data(){
            return{
                collageGroups:[],
                flag:0,
            }
        },
          created(){
            if(this.flag==0){
                api.get('/getNotGroupsOrder').then(res=>{
                    this.collageGroups=res;
                    this.flag=1;
                },err=>{
                    this.flag=1;
                })
            }
         },
        props:{
            order:{
                type:Boolean,
                default:false
            }
        }
    }
</script>
<style lang="scss" scoped>
    .othersCollageView{
        width: 355px;
        padding:10px 10px;
        background-color: white;
        .top{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding:5px 0;
            height: 20px;
            .text{
                font-size: 14px;
                color: $text-color;
            }
            .point{
                position: relative;
                height: 100%;
                width: 20px;
            }
            .point:before{
                content: '';
                position: absolute;
                top:50%;
                height: 1PX;
                width: 50PX;
                background-color: #cbcbcb;
                @include transformY(-50%)
            }
            .point:after{
                content: '';
                position: absolute;
                top:50%;
                height: 4PX;
                width: 4PX;
                background-color: #cbcbcb;
                @include radius(50%);
                @include transformY(-50%)

            }
            .point:first-child:before{
                left: -46px;
            }
            .point:last-child:before{
                right: -46px;
            }
            .point:first-child:after{
                left: 0;
            }
            .point:last-child:after{
                right: 0;
            }
        }
        .main{
            margin-top: 5px;
            width: 355px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            .item{
                width: 170.5px;
                margin-top: 10px;
                padding-bottom: 10px;
                border: 1px solid $line-color;
                @include radius(15px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .content{
                    width: 150px;
                    display: flex;
                    flex-direction: column;
                    .image{
                        align-self: center;
                    }
                    .collageName{
                        margin-top: 5px;
                        @include LongtextHidden;
                    }
                    .collagePrice{
                        margin-top: 5px;
                        font-size: 14px;
                        del{
                            color: #7a7a7a;
                        }
                        .price{
                            color: #ed9400;
                        }
                        .mode{
                            text-align: center;
                            font-size: 14px;
                            color: #ed9400;
                        }
                    }

                }
                .control{
                    width: 150px;
                    padding:0 10px;
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    margin-top: 5px;
                    align-items: center;
                    span{
                        font-size: 14px;
                    }
                    .normal{
                        color: black;
                        .success{
                            color: $main-color;
                        }
                    }
                    .toCollage{
                        @include reloadButton;
                        @include radius(8px);
                        padding: 5px 5px;
                        color: white;
                        background-color: #ed9400;
                        font-size: 14px;
                    }
                }
            }
        }
        .empty{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .icon{
                @include radius(50%);
                border:1px solid $line-color;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .text{
                margin-top: 5px;
                color: $text-color;
            }
        }
    }
     .noPadding{
         padding-left: 0;
         padding-right: 0;
     }
</style>