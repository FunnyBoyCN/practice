<template>
    <div class="padding-bottom">
        <back-nav :title="'购物车'"></back-nav>
        <div class="carContent">
            <transition-group name="list"
                              tag="ul"
            >
                <li class="carItem margin-bottom" v-for="(val,index) in shopCartContent" :key="val.id" >
                    <div  class="checkBox" @click="check(val)" :class="{checked:val.isSelected}">
                        <van-icon name="success" class="success" color="white"/>
                    </div>
                    <van-image
                            fit="contain"
                            lazy-load
                            :src="val.imgs[0]"
                            class="shopCarImg"
                            @click="preview(val.imgs)"
                    />
                    <div class="shopCarDs">
                        <div class="shopMessage">{{val.name}}X{{val.quantity}}</div>
                        <div class="shopPrice">售价:{{val.price*val.quantity}}元</div>
                        <van-stepper
                                v-model="val.quantity"
                                :min="1"
                                :max="20"
                                integer
                                @plus="UpdateShop(val,+1)"
                                @minus="UpdateShop(val,-1)"
                                @overlimit="overlimit"
                                @blur="blur(val)"
                                @change="change(val)"
                        />
                    </div>
                    <van-icon name="delete"  color="gray"  size="1.5rem" class="deleted" @click="del(val)"/>
                </li>
            </transition-group>
        </div>
        <div class="margin-top" v-if="!isLogin">
            <van-cell title="请先登录"  value="登录" @click="toMine"/>
        </div>
        <div class="empty" v-if="ShopCartNum===0">
            <img src="https://m.mi.com/static/img/cartnull.daaf7926f8.png"/>
            <div>购物车空空如也</div>
            <van-button type="danger" @click="goHome">去购物</van-button>
        </div>
        <van-submit-bar
                :price="total"
                button-text="去结算"
                :safe-area-inset-bottom="true"
                :decimal-length="1"
                :disabled="isConfirmClass"
                @submit="goConfirm"
                v-if="ShopCartNum!==0"
        >
       <van-checkbox v-model="isSeletedAll" slot="default" class="margin-left" checked-color="#ff6700" @click="checkAll">全选</van-checkbox>
            <van-tag slot="default" color="#ff6700" class="margin-left" size="medium">已选{{selectedNum}}件</van-tag>
        </van-submit-bar>
    </div>
</template>
<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import backNav from '../components/backNav.vue'
import {Image,Stepper,Lazyload,SubmitBar,Checkbox,Tag,ImagePreview,Toast,Cell,Dialog,Button} from  'vant'
import 'vant/lib/image/style'
import 'vant/lib/stepper/style'
import 'vant/lib/lazyload/style'
import 'vant/lib/submit-bar/style'
import 'vant/lib/checkbox/style'
import 'vant/lib/tag/style'
import 'vant/lib/image-preview/style'
import 'vant/lib/toast/style'
import 'vant/lib/cell/style'
import 'vant/lib/dialog/style'
import 'vant/lib/button/style'
Vue.use(Image).use(Stepper).use(Lazyload).use(SubmitBar).use(Checkbox).use(Tag).use(ImagePreview).use(Toast).use(Cell).use(Button);
     export default{
       components:{
           backNav
       },
        data(){
           return{
              checkBoxClass:'checkBox',
               leftwidth:0,
               skuNum:1,
               isSeletedAll:false,
               total:0,
               selectedNum:0,
               selectedId:[], //选择的商品sku id
           }
        },
         created(){
            if(this.isLogin){
                this.$store.commit('render/IsHome',false);
            }
             this.isSeletedAll=false;
             this.shopCartContent.forEach((v)=>{
                 v.isSelected=false;
             })
         },
         mounted(){
             this.$store.dispatch('userMs/getShopCart')
         },
         computed:{
             ...mapState("userMs",['isLogin','ShopCartNum','shopCartContent']),
             isConfirmClass(){
               if(this.selectedId.length===0){
                   return true
               }else {
                   return false
               }
             },
         },
        methods:{
            preview(url){
                ImagePreview(url)
            },
            delSelectedId(val){  //取消选中的商品id
                if(this.selectedId.length>0){
                    this.selectedId.forEach((v,k)=>{
                        if(v===val.id){
                            this.selectedId.splice(k,1)
                        }
                    })
                }
            },
            check(val){
                if(val.isSelected){
                    val.isSelected=false;
                    this.isSeletedAll=false;
                    this.selectedId.forEach((v,k)=>{
                        if(v===val.id){
                            this.selectedId.splice(k,1)
                        }
                    })

                }else{
                    val.isSelected=true;
                    this.selectedId.push(val.id);
                }
                this.cal();
            },
            UpdateShop(val,num){  //增减购物车
                let data={
                    id:0,
                    quantity:0
                };
                data.id=val.id;
                data.quantity=+val.quantity+num;
                this.$store.dispatch("userMs/changeShopCart",data).then(()=>{
                    this.cal();
                });
            },
            cal(){
                let total=0;
                let selectedNum=0;
                let allQuantity=0;
                this.shopCartContent.forEach((v,k)=>{
                    allQuantity+=(+v.quantity);
                    if(v.isSelected){
                        total+= (+v.price*+v.quantity);
                        selectedNum+=(+v.quantity)
                    }
                });
                if(allQuantity===selectedNum){
                    this.isSeletedAll=true
                }
                this.total=total*100;
                this.selectedNum=selectedNum;
            },
            checkAll(){  //全选
                if(this.isSeletedAll){
                    this.isSeletedAll=false;
                    this.shopCartContent.forEach(v=>{
                        v.isSelected=false;
                    })
                    this.cal();
                    this.selectedId=[];
                }else {
                    this.isSeletedAll=true;
                    this.shopCartContent.forEach(v=>{
                        v.isSelected=true;
                        this.selectedId.push(v.id);
                    })
                    this.cal();
                }
            },
            del(val){ //删除购物车
                Dialog.confirm({
                    title:'提示',
                    message: '是否删除该商品'
                }).then(() => {
                    this.delSelectedId(val);
                let data={
                    id:0,
                    quantity:0
                };
                if(this.isSeletedAll){
                    this.isSeletedAll=false;
                }
                data.id=val.id;
                this.shopCartContent.forEach((v,k)=>{
                    if(v.id===val.id){
                        this.shopCartContent.splice(k,1)
                    }
                });
                this.cal();
                this.$store.dispatch("userMs/changeShopCart",data);
                }).catch(() => {

                });
            },
            overlimit(){

            },
            change(val){
                if(+val.quantity<1){
                    val.quantity=1
                }
                if(+val.quantity>20){
                    console.log('20')
                    val.quantity=20
                }
            },
            blur(val){
                let data={
                    id:val.id,
                    quantity:+val.quantity
                };
                this.$store.dispatch("userMs/changeShopCart",data).then(()=>{
                    this.cal();
                });
            },
            goConfirm(){
                this.$router.push({ path: '/MobileCheckOut', query: { ids: this.selectedId.toString(),total:this.total,num: this.selectedNum}})
            },
            goHome(){
                this.$router.push('/')
            },
            toMine(){
                this.$router.push('/mine')
            }
        }
    }
</script>
<style lang="scss" scoped>
.padding-bottom{
    padding-bottom: 50px;
}
.list-enter, .list-leave-to
   {
    opacity: 0;
    transform: translateX(375px);
}
.list-move{
    transition: all 0.5s ease;
}
.list-leave-active {
    position: absolute;
}
.carContent{
    margin-top: 55px;
    .carItem{
        transition: all 0.5s;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        background-color: white;
        height: 118.75px;
        .checkBox{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin: 0 10px;
            border: 1PX solid #7a7a7a;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            .success{
                display: none;
            }
        }
        .checked{
            background-color: #ff6700;
            .success{
                display: inline-block;
            }
        }
        .shopCarImg{
            width: 80px;
            height: 80px;
            border: 1PX solid #e5e5e5;
        }
        .shopCarDs{
            width: 187.5px;
            margin-left: 15px;
            .shopMessage{
                margin-bottom: 5px;
                font-size: 15px;
            }
            .shopPrice{
                font-size: 14px;
            }
        }
        .deleted{
            /*position: absolute;*/
            /*bottom: 5px;*/
            /*right: 5px;*/
            margin-left: 5px ;
            margin-top: 15px;
        }
    }
}
.empty{
    padding: 35px 35px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    width: 300px;
    img{
        margin-right: 15px;
        width: 50px;
        height: 50px;
    }
}
    .margin-bottom{
        margin-bottom: 10px;
    }
    .margin-left{
        margin-left:15px ;
    }
    .van-button--danger{
        background-color: #ff6700;
        border-color: #ff6700;
    }
    .margin-top{
        margin-top: 60px;
    }
</style>