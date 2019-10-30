<template>
    <div class="padding-bottom">
         <back-nav title="用户结算"></back-nav>
        <div class="addressShow padding rowFlex bgWhite margin-bottom" @click="ToEdit" v-if="userAddMs.length>0">
            <div class="ShowArea columnFlex">

                 <div class="topShow">{{chooseAddress.recipient}} 收 电话： {{phone.slice(0,3)}}****{{phone.slice(7,11)}}</div>
                 <div class="AddressDetail normalFontSize">{{chooseAddress.address}} {{chooseAddress.area}}</div>
            </div>
            <van-icon name="arrow" size="1.5rem"></van-icon>
        </div>
        <div class="addressShow rowFlex bgWhite margin-bottom" v-else style="justify-content: center" @click="ToEdit">
            <div class="ShowArea columnFlex" style="text-align: center">
                <van-icon name="plus" size="0.6rem" class="margin-miniBottom"></van-icon>
                <div>添加新地址</div>
            </div>

        </div>
        <div class="margin-bottom">
            <div class="chooseShop padding rowFlex bgWhite" v-for="(v) in chooseShopContent">
                <div class="leftContent rowFlexFlexStart">
                    <van-image
                            class="img"
                            :src="v.imgs[0]"
                            fit="cover"
                    />
                    <div class="shopDes margin-left normalFontSize">
                        {{v.name}} X{{v.quantity}}
                    </div>
                </div>
                <div class="shopPrice normalFontSize">{{v.price*v.quantity}}元</div>
            </div>
        </div>

        <div class="totalPrice columnFlex padding bgWhite">
            <div class="rowFlexFlexStart margin-bottom border-bottom messageItem" >
                <div class="title normalFontSize ">商品价格:</div>
                <div >{{totalPrice}}元</div>
            </div>
            <div class="rowFlexFlexStart margin-bottom  border-bottom messageItem">
                <div class="title normalFontSize">已优惠:</div>
                <div class="">0元</div>
            </div>
            <div class="rowFlexFlexStart messageItem">
                <div class="title normalFontSize">配送费用:</div>
                <div class="">0元</div>
            </div>

        </div>
        <div class="bottomBtn rowFlex">
            <div class="item bgWhite rowFlexFlexStart ">
                <div class="normalFontSize">共{{selectedNum}}件  合计:</div>
                <div class="ThemeColor boldFont fontSizeMax">{{totalPrice}}.00</div>
            </div>
            <div class="item btn normalFontSize " :class="{disabled:chooseAddId===''}" @click="goOrder">去付款</div>
        </div>
    </div>
</template>
<script>
import backNav from '../components/backNav.vue'
import {Icon,Image,Toast,Dialog} from 'vant'
import 'vant/lib/icon/style'
import 'vant/lib/image/style'
import 'vant/lib/toast/style'
import 'vant/lib/dialog/style'
import Vue from 'vue'
import {mapState} from 'vuex'
import {api} from '../utils/api'
import {myApi} from '../utils/myApi'
Vue.use(Icon).use(Image).use(Toast);
export default{
    components:{
        backNav
    },
    created(){
        this.$store.commit('render/IsHome',false);
        this.$store.dispatch('userMs/getUserAddress');
        this.ids=this.$route.query.ids.split(',');
        this.totalPrice=this.$route.query.total/100;
        this.selectedNum=this.$route.query.num;
        this.shopCartContent.forEach((v)=>{
            this.ids.forEach((i)=>{
                if(i===v.id){
                    this.chooseShopContent.push(v)
                }
            })
        });
    },
    mounted(){
        this.userAddMs.forEach((v)=>{
            if(v.address_id===this.chooseAddId){
                this.chooseAddress=v;
            }
        });
        this.phone=this.chooseAddress.phone;
    },
    data(){
      return{
          chooseAddress:{},
          ids:[],
          chooseShopContent:[],
          totalPrice:0,
          selectedNum:0,
          Order:'',
          phone:''
      }
    },
    computed:{
       ...mapState("userMs",["shopCartContent",'userAddMs',"chooseAddId",'userId']),
    },
    methods:{
        ToEdit(){
            this.$router.push('/AddressEdit')
        },
        goOrder(){
            const time=Date.now();
            if(this.chooseAddId===''){
                Toast.fail({
                    mask:true,
                    message:'您还未选择地址',
                })
            }else {
              api.post('/user/checkout',{ids:this.ids.toString(),address_id:this.chooseAddId}).then(res=>{
                    this.Order=res;
                    this.chooseShopContent.forEach(v=>{
                        v.isAppraise=false;
                    })
                    const data={
                        address:this.chooseAddress,
                        userId:this.userId,
                        Order:this.Order,
                        state:0,
                        time:time,
                        ShopContent:this.chooseShopContent,
                        totalPrice:this.totalPrice,
                    };
                  myApi.post('/PostOrder',data).then(res=>{ //添加到数据库
                      Toast.success({
                          mask:true,
                          message:res,
                          duration: 500,
                          forbidClick: true,
                      });
                      Dialog.alert({
                          title: '下单成功',
                          message: '前往订单页查看'
                      }).then(() => {
                            this.$store.dispatch('userMs/getOrderNum',this.userId)
                            this.$router.replace('/myOrder')
                      });
                  })
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.addressShow{
    margin-top: 50px;
    height: 65px;
    .ShowArea{
        width: 80%;
          .topShow{
              font-size: 16px;
              font-weight: bold;
          }
    }

}
.chooseShop{
   position: relative;
    .leftContent{
         .img{
             width: 50px;
             height: 50px;
             border: 1PX solid #b1b1b1;
         }
        .shopDes{
            width: 200px;
        }

    }
    .shopPrice{
        min-width: 50px;
        font-weight: bold;
    }
}
.chooseShop:last-child:after{
    width: 0;
}
.chooseShop:after{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 1PX;
    content: '';
    background-color: #b1b1b1;
    width: 345px;
}
.totalPrice{
    justify-content: center;
    .title{
        font-weight: bold;
        width: 80px;
    }
}
.bottomBtn{
    height: 50px;
    position: fixed;
    width: 375px;
    bottom: 0;
    .item{
        text-align: center;
        height: 100%;
        line-height: 50px;
    }
    .item:first-child{
        width: 60%;
        justify-content: center;
    }
    .item:last-child{
        width: 40%;
    }
    .btn{
        background-color: #ff6700;
        color: white;
    }
    .ThemeColor{
        color: #ff6700;
    }
    .disabled{
        background-color: rgba(255, 112, 0, 0.34);
    }
}
    .padding{
        padding: 15px 20px;
    }
    .margin-bottom{
        margin-bottom: 15px;
    }
    .margin-left{
        margin-left: 15px;
    }
    .margin-miniBottom{
        margin-bottom: 5px;
    }
    /*.margin-top{*/
        /*margin-top: ;*/
    /*}*/
    .rowFlex{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .columnFlex{
        display: flex;
        flex-direction: column;
    }
.rowFlexFlexStart{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
    .normalFontSize{
        font-size: 14px;
    }
    .boldFont{
        font-weight: bold;
    }
    .bgWhite{
        background-color: white;
    }
    .fontSizeMax{
        font-size: 16px;
    }
    .padding-bottom{
        padding-bottom: 50px;
    }
    .messageItem{
        position: relative;

    }
      .messageItem:after{
          position: absolute;
          content: "";
          background-color: #e5e5e5;
          top:30px;
          width: 335px;
          height: 1px;
      }
.messageItem:last-child:after{
    height: 0;
}
</style>