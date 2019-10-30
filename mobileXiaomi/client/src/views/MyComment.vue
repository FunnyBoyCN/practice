<template>
    <div>
        <back-nav :title="'我的评价'"></back-nav>
        <div class="main">
            <title-text :titleName="'商品内容'"></title-text>
            <div class="padding bgWhite row  alignCenter">
                <template v-if="shopContent.imgs">
                    <van-image
                            width="50"
                            height="50"
                            class="imgBorder"
                            :src="shopContent.imgs[0]"
                            @click="ImagePreview(shopContent.imgs)"
                    />
                </template>
                <span class="fontMarginLeft NormalFont">{{shopContent.name}}</span>
            </div>
            <div class="marginTop bgWhite ">
                <title-text :titleName="'评价星级'"></title-text>
                <div class="padding row alignCenter justContentCenter">
                    <van-rate v-model="comment.start" disabled :allow-half="true"/>
                </div>
            </div>
            <div class="marginTop bgWhite">
                <title-text :titleName="'我的评论'"></title-text>
                <div class="padding column alignCenter">
                    <div class="row">
                        <van-image
                                width="150"
                                class="imgBorder"
                                :src="comment.img"
                                @click="ImagePreview(comment.img)"
                        />
                    </div>
                    <div class="padding marginTop border width">{{comment.textContent}}</div>
                </div>
            </div>
            <div class="marginTop bgWhite padding-leftAndRight bottomHeight row  flexBetween alignCenter">
                <van-checkbox v-model="comment.isAnonymous" disabled>匿名评论</van-checkbox>
            </div>
        </div>
    </div>
</template>
<script>
    import {myApi} from '../utils/myApi'
    import {Image,ImagePreview,Rate,Field,Button,Checkbox} from 'vant'
    import Vue from 'vue'
    import 'vant/lib/image/style'
    import 'vant/lib/image-preview/style'
    import 'vant/lib/rate/style'
    import 'vant/lib/field/style'
    import 'vant/lib/button/style'
    import 'vant/lib/checkbox/style'
    Vue.use(Image).use(ImagePreview).use(Rate).use(Field).use(Button).use(Checkbox);
    import backNav from '../components/backNav.vue'
    import titleText from '../components/title.vue'
     export default{
         data(){
             return{
                 shopContent:{},
                 comment:{},
             }
         },
         components:{
             backNav,
             titleText
         },
         computed:{

         },
         methods:{
             ImagePreview(url){
                 let urlArray=[];
                 urlArray.push(url)
                 ImagePreview({
                     images:urlArray,
                 });
             },
         },
         mounted(){
             this.shopContent=this.$route.query.content;
             myApi.get(`getPersonComment?sku=${+this.$route.query.sku}`).then(res=>{
                    res.forEach(v=>{
                        if(v.Order===this.$route.query.Order){
                            this.comment=v;
                        }
                    })
             });
         },
     }
</script>
<style lang="scss" scoped>
    .main{
        padding-top: 50px;
    }
    .imgBorder{
        border: 1px solid #e5e5e5;
    }
    .marginTop{
        margin-top: 15px;
    }
    .padding{
        padding: 15px 15px;
    }
    .bgWhite{
        background-color: white;
    }
    .padding-leftAndRight{
        padding-left: 15px;
        padding-right: 15px;
    }
    .row{
        display: flex;
        flex-direction: row;
    }
    .column{
        display: flex;
        flex-direction: column;
    }
    .justContentCenter{
        justify-content: center;
    }
    .alignCenter{
        align-items: center;
    }
    .flexEndRight{
        justify-content: flex-end;
    }
    .fontMarginLeft{
        margin-left: 5px;
    }
    .NormalFont{
        font-size: 14px;
    }
    .doubleBorder{
        border: 1px dashed #e5e5e5;
        height: 150px;
    }
    .bottomHeight{
        height: 46px;
    }
    .flexBetween{
        justify-content: space-between;
    }
    .border{
        border: 1px dashed #7a7a7a;
    }
    .width{
        width: 300px;
        text-align: center;
    }
    .van-icon-star{
       color: #ff6700 !important;
    }
</style>