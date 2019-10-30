<template>
    <div>
        <back-nav :title="'订单详情'"></back-nav>
        <div class="Detail ">
            <div class="item bgWhite padding padding-top padding-bottom" >
                <div class=" normalFontSize">
                    订单号:  {{DetailList.Order}}
                </div>
                <template v-if="DetailList.ShopContent">
                    <div class="border" v-for="(item,index) in DetailList.ShopContent" :Key="index" @click="evaluate(item)">
                      <div class="shopItem row marginTop" >
                    <van-image
                            width="50"
                            height="50"
                            :src="item.imgs[0]"
                            class="ImgBorder"
                    />
                    <div class="normalFontSize nameWidth">{{item.name}}</div>
                    <div class="normalFontSize ">{{item.price}}元  X{{item.quantity}}</div>
                    <van-icon :name="item.isOpen?'arrow-up':'arrow-down'" v-if="DetailList.state===1"/>
                     </div>
                    <div class="row padding-top flexEnd" v-show="item.isOpen&&DetailList.state===1">
                        <van-button v-if="!item.isAppraise" type="danger" @click="appraise(item,DetailList.Order)">评价</van-button>
                        <van-button type="default" size="small" v-else @click="toPersonComment(item)">查看我的评论</van-button >
                    </div>
                  </div>
                </template>
            </div>
            <div class="normalFontSize padding marginTop padding-bottom bgWhite padding-top">
                <div>商品总价  {{DetailList.totalPrice}}元</div>
                <div class="fontMarginTop">配送费用:  0元</div>
                <div class="fontMarginTop">订单总价 {{DetailList.totalPrice}}元</div>
            </div>
            <div class="normalFontSize padding marginTop padding-bottom bgWhite padding-top">
                <div>下单日期:  {{time}}</div>
                <template v-if="DetailList.address">
                <div class="fontMarginTop">收货地址:  {{DetailList.address.area}}  {{DetailList.address.address}}</div>
                <div class="fontMarginTop">收货人名: {{DetailList.address.recipient}} {{DetailList.address.phone.slice(0,3)}}****{{DetailList.address.phone.slice(7,11)}}</div>
                <div class="fontMarginTop">收货时间:  不限送货时间</div>
                <div class="fontMarginTop">发票类型:  电子发票</div>
                <div class="fontMarginTop">发票抬头:  个人</div>
                </template>
            </div>
            <div class="column normalFontSize padding-top padding-bottom">
                 <div>下载小米商城客户端后可以查看电子发票</div>
                 <van-button type="default" class="marginTop" url="//m.mi.com/p?fallback=http%3A%2F%2Fs1.mi.com%2Fm%2Fappdownload%2F%3Fmfull_ad" :replace="true">下载小米商城客户端</van-button>
            </div>
        </div>
    </div>
</template>
<script>
    import backNav from '../components/backNav.vue'
    import {api} from '../utils/api'
    import {myApi} from '../utils/myApi'
    import {Toast,Image,Button,Icon} from 'vant'
    import Vue from 'vue'
    import 'vant/lib/toast/style'
    import 'vant/lib/image/style'
    import 'vant/lib/button/style'
    import 'vant/lib/icon/style'
    Vue.use(Toast).use(Image).use(Button).use(Icon)
    export default{
        data(){
          return{
              DetailList:{},
              time:'',
              indexId:'',
              comment:[]
          }
        },
        components:{
          backNav
        },
        created(){
            this.$store.commit('render/IsHome',false);
        },
        methods:{
            timeTransfrom(time) {
                let date = new Date(time);
                let Month=date.getMonth()+1<10?`0${date.getMonth()+1}`:date.getMonth()+1;
                let Day=date.getDate()<10?`0${date.getDate()}`:date.getDate();
                let Hours=date.getHours()<10?`0${date.getHours()}`:date.getHours();
                let Minutes=date.getMinutes()<10?`0${date.getMinutes()}`:date.getMinutes();
                let Seconds=date.getSeconds()<10?`0${date.getSeconds()}`:date.getSeconds();
                return `${date.getFullYear()}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`;
            },
            evaluate(val){   //筛选已评论，显示查看评论
                if(val.isOpen){
                    this.$set(val,'isOpen',false)
                }else {
                  const result=this.checkCommented(val);
                  if(result){
                      this.$set(val,'isAppraise',true)
                  }else {
                      this.$set(val,'isAppraise',false)
                  }
                  this.$set(val,'isOpen',true)
                }
            },
            appraise(val,id){  //去评论页
                this.$router.push({path:'/Appraise',query:{
                    id:id,
                    content:val,
                }})
            },
            checkCommented(val){  //筛选评论相关
               let isCommented=false;
               this.comment.forEach(v=>{
                    if(+val.sku_id==v.sku){
                        isCommented=true;
                    }
                });

                return isCommented;
            },
            toPersonComment(val){
                this.$router.push({path:'/MyComment',query:{
                    sku:val.sku_id,
                    content:val,
                    Order:this.$route.query.id,
                }})
            }
        },
        mounted(){
            myApi.get(`getComment?Order=${this.$route.query.id}`).then(res=>{
               this.comment=res;
            });
            myApi.get(`/getOrderDetail?id=${this.$route.query.id}`).then((res)=>{
                this.DetailList=res[0];
            },(err)=>{
                Toast.fail({
                    message:err,

                })
            });
            this.time=this.timeTransfrom(this.$route.query.time);
        }
    }
</script>
<style lang="scss" scoped>
.Detail{
    padding-top: 50px;
     .item{

     }
}
    .bgWhite{
        background-color: white;
    }
    .padding{
        padding-left:  15px;
        padding-right:  15px;
    }
    .padding-top{
        padding-top: 15px;
    }
    .padding-bottom{
        padding-bottom: 15px;
    }
    .fontPadding{
        padding-top: 5px;
    }
    .fontMarginTop{
        margin-top: 5px;
    }
    .normalFontSize{
        font-size: 14px;
    }
    .marginTop{
        margin-top: 15px;
    }
    .row{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .ImgBorder{
        border: 1px solid #e5e5e5;
    }
    .nameWidth{
        width: 200px;
    }
    .column{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .link{
        color: black;
    }
.border{
    position: relative;
}
.border:after{
    position: absolute;
    content:'';
    bottom: -10px;
    height: 1px;
    width: 100%;
    background-color: #e5e5e5;
}
.border:last-child:after{
    height: 0;
}
    .flexEnd{
        justify-content: flex-end;
    }
</style>