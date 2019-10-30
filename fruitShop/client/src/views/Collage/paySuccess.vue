<template>
    <div class="paySuccess">
        <navbar :navbarTitle="'付款成功'"/>
        <div class="contentShow">
            <template v-if="collage.goods">
                <van-image
                        width="130"
                        height="130"
                        :src="collage.goods.goodsImg[0]"
                        class="image"
                        fit="cover"
                />
            </template>
            <div class="right">
                <h3>限时抢购</h3>
                <template v-if="collage.goods">
                    <del>￥{{collage.goods.realPrice}}</del>
                </template>
                <template v-if="collage.price">
                <span class="price">￥{{collage.price.toFixed(2)}}</span>
                </template>
            </div>
        </div>
        <div class="collageOrderMode border">
            <div class="item" v-for="(i,index) in groups" :class="i.avatar==''?'notJoin':''">
                <van-image
                  :src="i.avatar"
                  width="45"
                  height="45"
                  fit="cover"
                  class="avatar"
                  v-if="i.avatar!==''"
                />
                <div class="pendingCollage"  v-if="i.avatar==''">?</div>
                <span class="group" >{{index==0?'团长':'团员'}}</span>
            </div>
        </div>
        <service :isPaySuccess="true"/>
        <share :isCollage="true" :orderShare="true" :countTime="time" />
        <others-collage/>
        <button class="toOrder" @click="toCollageOrder"><van-icon name="bill-o" size="18px" color="#7a7a7a" class="icon"/>订单页</button>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Image,CountDown,Toast} from 'vant'
    import {api} from '../../utils/api'
    Vue.use(Image).use(CountDown).use(Toast);
    import navbar from '../../components/navbar.vue'
    import service from '../../components/service.vue'
    import share from '../../components/share.vue'
    import othersCollage from '../../components/collage/othersCollage.vue'
    import timeTransForm from '../../utils/timeTransForm'
    export default{
          components:{
              navbar,
              service,
              share,
              othersCollage
          },
        data(){
              return{
                  collage:{

                  },
                  timeLimitString:'',
                  groups:[],
                  time:0,
                  disabled:false
              }
        },
        created(){
          const id=this.$route.query.id;
          api.get(`/getCollageOrder`,{
              params: {
              id: id,
              _slient:true
          }}).then(res=>{
              this.init(res);
          },error=>{
              Toast.fail(error.response.data.data.message);
          })
        },
        mounted(){

        },
        methods:{
            toCollageOrder(){
                this.$store.dispatch('tabbar/changeTabbarName','/Orders/timelyOrder');
                this.$router.push({
                    path:'/Orders',
                    query:{
                        orderMode:'collageOrder'
                    }
                })
            },
            async init(response){
                this.collage=response;
                this.time=(this.collage.createdPayTime+(1000*60*60*24))-Date.now();
                this.time==0?this.time=-1000:this.time;
                this.timeLimitString=timeTransForm(this.collage.timeLimit);
                this.shareData(this.collage);
                for(let i=0;i<this.collage.mode;i++){
                    this.groups.push({avatar:''});
                }
               await this.collage.joinPeople.forEach(async (v,k)=>{
                   this.groups[k].avatar=await api.get('/avatar',{
                        params:{
                            id:v
                        }
                    });
                });
            },
            shareData(collage){
//                const url=this.$route.fullPath;
                const data={
                    mainImageUrl:'',
                    qrCodeText:'',
                    nameAndDesc:'',
                    spec:'',
                    timeLimit:'',
                    mode:'',
                    realPrice:'',
                    price:''
                };
                data.mainImageUrl=collage.goods.goodsImg[0];
                data.qrCodeText=`http://sunnyboy1994.gitee.io/practice/fruitShop/dist/#/Collage/checkout?id=${this.collage.parentID}&&createdId=${this.collage.createdId}`;
                data.nameAndDesc=collage.goods.name+collage.goods.desc;
                data.spec=collage.goods.spec;
                data.realPrice=collage.price;
                data.price=collage.goods.realPrice;
                data.mode=collage.mode;
                data.timeLimit=this.timeLimitString;
                this.$store.dispatch('share/CreatedShare',data);
            }
        }
     }
</script>
<style lang="scss" scoped>
    .contentShow{
        width: 355px;
        height: 150px;
        padding:10px 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        background-color: white;
        .image{

        }
        .right{
            width: 35%;
            height: 130px;
            @include radius(8px);
            background-color: rgba(237, 148, 0, 0.15);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .price{
                color: #ed9400;
                font-size: 25px;
                margin-bottom: 7.5px;
            }
        }
    } //拼团内容
    .collageOrderMode{
        padding: 20px 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: white;
        .item{
            @include radius(50%);
            border: 1px solid #ed9400;
            width: 45px;
            height: 45px;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .avatar{
              overflow: hidden;
               @include radius(50%);
            }
            .pendingCollage{
                width: 45px;
                height: 45px;
                @include radius(50%);
                overflow: hidden;
                text-align: center;
                line-height: 45px;
                font-size: 18px;
                color: #ed9400;
            }
            .group{
                position: absolute;
                bottom: -8px;
                left: 50%;
                width: 36px;
                margin-left: -18px;
                background-color: #ed9400;
                color: white;
                font-size: 12px;
                text-align: center;
                @include radius(5px);
            }
        }
        .notJoin{
            border: 1px dashed #ed9400;
        }
    } //拼团模式人员
    .paySuccess{
        background-color: $bg-color;
        padding-bottom: 50px;
    }
    .invite{
        margin-top:15px;
        padding:10px 15px;
        background-color: white;
        .content{
            @include radius(37.5px);
            padding:10px 10px;
            background-color: #ed9400;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .countTime{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-left: 25px;
                .countTimeContent{
                    height:24px;
                    line-height: 24px;
                    text-align: center;
                    color: white;
                    font-size: 18px;
                    margin-right: 5px;
                }
            }
            span{
                font-size: 16px;
                color: white;
            }
            .countTime>span:first-child{
                margin-right: 5px;
            }
        }
    } //邀请操作
    .toOrder{
        position: fixed;
        @include reloadButton;
        padding:10px 10px;
        border: 1px solid $line-color;
        border-right: 0;
        border-left: 0;
        height: 50px;
        width: 375px;
        bottom: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: $text-color;
        .icon{
            margin-right: 5px;
        }
    }
</style>