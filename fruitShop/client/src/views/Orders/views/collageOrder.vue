<template>
    <div>
        <div class="item marginTop paddingLR flex column" v-for="item in collageOrder" @click="toDetail(item._id)">
            <div class="top paddingTB flex alignCenter spaceBetween border">
                <div class="mode flex row justCenter alignCenter"><span>{{item.mode}}人团</span></div>
                <div class="state">{{orderState(item.state)}}</div>
            </div>
            <collage-content  :collage="contentCollage(item)" :isDetail="false"/>
            <div class="collageShop paddingTB border" v-show="item.state!=-1">
                提货门店：{{item.pickupShop.name}}
            </div>
            <div class="state paddingTB" >
                <div class="text" >
                    <div class="item cancel" v-show="item.state==-1">
                        取消时间：{{item.cancelTime}}
                    </div>
                    <div class="item time" v-show="item.state==0">
                        付款剩余时间：<count-time :stopTime="stopTime(item.createdTime)" @stop="stop"/>
                    </div>
                    <div class="item time" v-show="item.state==1">
                        分享好友拼团吧
                        <van-icon class="icon"  name="arrow"/>
                    </div>
                    <div class="item time" v-show="item.state==2&&item.open">
                        提货码：{{item.pickUpNum}}
                    </div>
                </div>
                <button class="button"  @click.stop="stateControl(item.state).method(item)">{{stateControl(item.state).text}}</button>
            </div>
            <transition enterActiveClass="fadeIn" leaveActiveClass="fadeOut">
                <other-collage v-show="item.other" class="others animated faster" :order="true"/>
            </transition>
        </div>
        <payMode v-if="payMode" @payModeShow="Show" :totalPrice="totalPrice"  :payId="payId" :isCollageCheckout="true"/>
        <share :isCollage="true"  ref="share" :order="true" @openTabbar="openTabbar"/>
        <no-data :text="'拼团'" v-if="noResult"/>
    </div>
</template>
<script>
    import collageContent from '../../../components/orderDetail/collageContent.vue'
    import countTime from '../../../components/orderDetail/countTime.vue'
    import payMode from '../../../components/pay/outPayMode.vue'
    import otherCollage from '../../../components/collage/othersCollage.vue'
    import noData from '../../../components/order/noData.vue'
    import share from '../../../components/share.vue'
    import {Image,Toast} from 'vant'
    import {mapState} from 'vuex'
    import Vue from 'vue'
    import {api} from '../../../utils/api'
    import timeTransForm from '../../../utils/timeTransForm'
    Vue.use(Image).use(Toast);
      export default{
        inject:['reload'],
        data(){
            return{
                collageOrder:[],
                stateDemo:[{
                    state:-1,
                    buttonGroups:{
                        text:'重新购买',
                        method:this.buyAgain
                    }
                },{
                    state:0,
                    buttonGroups:{
                        text:'立即付款',
                        method:this.pay
                    }
                },{
                    state:1,
                    buttonGroups:{
                        text:'邀请好友',
                        method:this.invite
                    }
                },{
                    state:2,
                    buttonGroups:{
                        text:'提货码',
                        method:this.pickUp
                    }
                },{
                    state:3,
                    buttonGroups:{
                        text:'参与其他',
                        method:this.others
                    }
                }],
                totalPrice:0,
                payId:'',
                share:false,
                timeLimitString:'',
                payMode:false,
                noResult:false
            }
        } ,
          computed: {
             orderState(){
                 return function (state) {
                     let text='';
                     switch (state){
                         case -1:
                             text='已取消';
                             break;
                         case 0:
                             text='待付款';
                             break;
                         case 1:
                             text='已付款';
                             break;
                         case 2:
                             text='已成团';
                             break;
                         case 3:
                             text='已提货';
                             break;
                     }
                     return text;
                 }
             }, //订单状态
              stateControl(){
                 return function (state) {
                     let stateControl={};
                     this.stateDemo.forEach(v=>{
                          if(v.state==state){
                              stateControl=v.buttonGroups;
                          }
                     });
                     return stateControl
                 }
              }, //订单状态控制显示
              stopTime(){
                  return function (startTime) {
                      let stopTime;
                      const NowTime=Date.now();
                      const isOver=NowTime-startTime;
                      if(isOver<(1000*60*15)){
                          stopTime=(Math.round((1000*60*15-isOver)/1000))*1000;
                      }else {
                          stopTime=0;
                      }
                      return stopTime;
                  }
              }, //计算倒计时时间
              contentCollage(){
                  return function (collage) {
                      collage.price=Number(collage.price).toFixed(2);
                      return collage
                  }
              }
          },
        components:{
            collageContent,
            share,
            payMode,
            countTime,
            otherCollage,
            noData
        },
        methods:{
            Show(val){
                this.payMode=val;
            },
            toDetail(id){
                this.$store.dispatch('pay/ChangePayPrice',this.totalPrice);
                this.$store.dispatch('pay/ChangePayId',id);
                this.$router.push({path:'/Orders/collageOrder/detail',query:{id}});
            },
            buyAgain(item){
                this.$router.push({
                    path:'/Collage/checkout',
                    query:{
                        id:item.parentID
                    }
                })
            },
            pay(item){
                api.get('/payPassword').then(res=>{
                    this.totalPrice=Number(item.price);
                    this.payId=item._id;
                    this.payMode=true;
                }).catch(err=>{
                    Dialog.alert({
                        title: '您还未设置支付密码',
                        message: '立即去设置',
                        confirmButtonText:'现在',
                        confirmButtonColor:'#19a251',
                        cancelButtonText:'稍候',
                        showCancelButton:true
                    }).then(() => {
                        this.$router.push({
                            path:'/editPayPassword',
                        })
                    }).catch(()=>{
                        return false;
                    });
                })

            },
            stop(val){  //时间停止
                if(val){
                    const timer=setTimeout(()=>{
                        this.reload();
                        this.$router.replace({
                            path:'/Orders',
                            query:{
                                orderMode:'collageOrder'
                            }
                        });
                        clearTimeout(timer)
                    },500)
                }
            },
            openTabbar(val){
                this.$store.dispatch('tabbar/changeHidden',val);
            },
            async invite(item){
                const collageOrder=await api.get('/getCollageOrder',{params:{
                    id:item._id
                }});
                this.timeLimitString=timeTransForm(collageOrder.timeLimit);
                this.shareData(collageOrder);
                this.share=true;
                this.$refs.share.openShare=true;
                this.$store.dispatch('tabbar/changeHidden',true)
            },
            pickUp(item){
                if(!item.open){
                    this.$set(item,'open',true)
                }else {
                    this.$set(item,'open',false)
                }
            },
            others(item){
                if(item.other){
                    this.$set(item,'other',false)
                }else {
                    this.collageOrder.forEach(v=>{
                        this.$set(v,'other',false)
                    });
                    this.$set(item,'other',true)
                }
            },
            shareData(collageOrder){
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
                data.mainImageUrl=collageOrder.goods.goodsImg[0];
                data.qrCodeText=`http://sunnyboy1994.gitee.io/practice/fruitShop/dist/#/Collage/checkout?id=${collageOrder.parentID}&&createdId=${collageOrder.createdId}`;
                data.nameAndDesc=collageOrder.goods.name+collageOrder.goods.desc;
                data.spec=collageOrder.goods.spec;
                data.realPrice=collageOrder.price;
                data.price=collageOrder.goods.realPrice;
                data.mode=collageOrder.mode;
                data.timeLimit=this.timeLimitString;
                this.$store.dispatch('share/CreatedShare',data);
            }
        },
         created(){
              api.get(`/getCollageOrder`).then(res=>{
                  this.collageOrder=res;
                  if(res.length==0){
                     this.noResult=true;
                  }
              });
          }
      }
</script>
<style lang="scss" scoped>
    .border:after{
        position: absolute;
        @include transformX(-10px);
        width: 375px;
    }
    .item{
        background-color: white;
        .top{
            .mode{
                color: #ed9400;
                border: 1px solid #ed9400;
                background-color: white;
                width: 51px;
                height: 19px;
                padding:0 8px;
                @include radius(15px);
                box-sizing: border-box;
                span{
                    font-size: 12px;
                    display: inline-block;
                }
            }
            .state{
                font-size: 14px;
                color: #ed9400;
            }
        }
        .collageShop{
            font-size: 14px;
            color: $text-color;
        }
        .state{
            font-size: 14px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .item{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                line-height: 24px;
                height: 24px;
                .icon{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 24px;
                    margin-left: 5px;
                }
                .text{

                }
            }
            .button{
                @include reloadButton;
                @include radius(15px);
                justify-self: flex-end;
                color: white;
                padding: 5px 10px;
                background-color: #ed9400;
            }

        }
    }
</style>