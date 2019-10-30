<template>
    <div class="flex row flexEnd orderControlView">
        <div class="buttonGroup flex row">
            <button v-for="(item,index) in buttonGroup" @click="item.method" :class="item.className">
                {{item.text}}
            </button>
            <button class="pay notPay" @click.stop="pay" v-if="realState==0"><count-time-view class="countTime" @stop="stop" :stopTime="stopTime" :isDetail="true"/>&nbsp<span>付款</span>  </button>
        </div>
    </div>
</template>
<script>
   import countTimeView from '../../components/orderDetail/countTime.vue'
   import {mapState} from 'vuex'
   import {api} from '../../utils/api'
   import Vue from 'vue'
   import {Dialog} from 'vant'
   Vue.use(Dialog);
   export default{
       data(){
           return{
               buttonGroup:[],
               startTime:0,
               stopTime:0,
               realState:0,
               cancel:{
                 text:'取消订单',
                 method:this.cancelOrder,
                 className:'',
                  defaultClass:''
               },
               contact:{
                   text:'联系店家',
                   method:this.call,
                   className:'',
                   defaultClass:''
               },
               repurchase:{
                  text:`重新购买`,
                  method:this.Repurchase,
                  className:'pay',
                  defaultClass:' '
               }
           }
       },
       components:{
           countTimeView,
       },
       props:{
           isCollage:{
               type:Boolean,
               default:false,
           },
           createdTime:{
               type:Number,
               default:0,
           },
          state:{
               type:Number,
               default:0,
          }
       },
       inject:['reload'],
       methods:{
           checkOverTime(){     //判断订单状态 生成倒数时间
               if(this.realState==0){
                   const NowTime=Date.now();
                   const isOver=NowTime-this.startTime;
                   if(isOver<(1000*60*15)){
                       this.stopTime=(Math.round((1000*60*6-isOver)/1000))*1000;
                   }
               }
           },
           stop(val){
             this.$emit('parentStop',val);
           },
           checkButtonGroup(){      //判断订单状态展示控制按钮
               switch (this.realState){
                   case -1:
                       this.buttonGroup=[];
                       this.buttonGroup.push(this.contact,this.repurchase);
                       break;
                   case 0:
                       this.buttonGroup=[];
                       if(this.isCollage){
                           this.buttonGroup.push(this.cancel,this.contact);
                       }else {
                           this.buttonGroup.push(this.cancel);
                       }
                       break;
                   case 1:
                       this.buttonGroup=[];
                       this.repurchase.text='再次购买';
                       this.buttonGroup.push(this.contact,this.repurchase);
                       break;
               }
           },
           call(){
               let a=document.createElement(`a`);
               a.setAttribute('href',`tel:186-8977-2300`);
               document.body.appendChild(a);
               a.click();
               a.remove();
           },
           pay(){
              this.$emit('payMode',true);
           },
           Repurchase(){      //重新购买
               api.get(`/order?id=${this.payId}`).then(async res=>{
                   await this.$store.dispatch('carts/ShopAgain',res.carts);
                   await this.$router.replace('/checkout');
               })
           },
           cancelOrder(){     //取消订单
               Dialog.confirm({
                   title: '订单取消',
                   message: '是否取消'
               }).then(() => {
                   api.post('/cancelOrder',{id:this.payId}).then(res=>{
                       this.reload();
                       this.Notify({ type: 'success', message: res.message})
                   },err=>{
                       this.Notify({ type: 'danger', message: err.response.data.data.message })
                   })
               }).catch(() => {
                   return false;
               });
           }
       },
       mounted(){
         this.checkButtonGroup();
       },
       computed:{
           ...mapState('pay',['payId'])
       },
       watch:{          //props异步获取数据监听
           createdTime(val,oldval){
               if(val!==oldval){
                   this.startTime=this.createdTime;
                   this.checkOverTime();
               }
           },
           state(val,oldval){
               if(val!==oldval){
                   this.realState=val;
                   this.checkButtonGroup();
               }
           }
       }
   }
</script>
<style lang="scss" scoped>
    .orderControlView{
        position: fixed;
        bottom: 0;
        height: 30PX;
        width: 355px;
        padding:10PX 10px;
        background-color: white;
        .buttonGroup{
            button{
                @include radius(15px);
                @include reloadButton;
                border: 1px solid $text-color;
                padding:5px 10px;
                font-size: 14px;
                margin-left: 15px;
            }
            .collage{
                border-color: #ed9400;
                color: #ed9400;
            }
            .pay{
                border: 0;
                background-color: #ed9400;
                color: white;
            }
            .notPay{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
        }
    }

</style>