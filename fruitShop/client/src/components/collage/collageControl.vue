<template>
    <div class="buttonView">
        <template v-for="(item,index) in buttonGroups">
            <button class="item" :class="item.text=='邀请好友'?'invited':''" @click.stop="item.method" :style="{backgroundColor:item.buttonBg,color:item.buttonBg=='white'?'black':'white',border:item.buttonBg=='white'?'1px solid #7a7a7a':'1px solid white'}"><van-icon v-if="item.text=='邀请好友'" name="share" size="20px" color="white" style="margin-right: 5px"/>{{item.text}}</button>
        </template>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Icon,Dialog,Toast} from 'vant'
    import {mapState} from 'vuex'
    import {api} from '../../utils/api'
    Vue.use(Icon).use(Dialog).use(Toast);
    export default{
         data(){
             return{
                 buttonGroups:[],
                 state:0,
                 myId:'',
             }
         },
        computed:{
            ...mapState('collageOrderDetail',['collageOrderDetail'])
        },
        inject:['reload'],
        methods:{
             initButtonGroups(state){
                switch (state){
                    case -1:{
                       this.buttonGroups.push({
                          text:'重新购买',
                           method:this.buyAgain,
                           buttonBg:'white',
                          });
                       break;
                      }
                    case 0:{
                        this.buttonGroups.push({
                            text:'取消订单',
                            method:this.cancel,
                            buttonBg:'white',
                        },{
                            text:'立即付款',
                            method:this.payNow,
                            buttonBg:'#ed9400',
                        });
                        break;
                    }
                    case 1:{
                        this.buttonGroups.push({
                            text:'取消订单',
                            method:this.cancel,
                            buttonBg:'white',
                        },
                            {
                            text:'邀请好友',
                            method:this.invite,
                            buttonBg:'#ed9400'
                            });
                        break;
                    }
                    case 2:{
                        this.buttonGroups.push({
                            text:'取消订单',
                            method:this.cancel,
                            buttonBg:'white'
                        },{
                            text:'取货地址',
                            method:this.checkPickUp,
                            buttonBg:'#19a251'
                        });
                        break;
                    }
                    case 3:{
                        break;
                    }
                  }
             },
            buyAgain(){
             this.$emit('buyAgain');
            },
            payNow(){
                this.$emit('payNow');
            },
            cancel(){
                Dialog.confirm({
                    title: '取消订单',
                    message: '是否执行该操作'
                }).then(() => {
                   api.post('/cancelCollageOrder',{id:this.myId,_slient:true}).then(res=>{
                       this.$store.dispatch('collageOrderDetail/OrderDetail',this.myId).then(()=>{
                           Toast.loading({
                               mask: false,
                               type:'success',
                               message: res.message,
                               duration:2500
                           });
                           this.reload();
                       });
                   },error=>{
                       Toast.loading({
                           mask: false,
                           icon:'cross',
                           message: error.response.data.data.message,
                           duration:2500
                       });
                   })
                }).catch(() => {
                    return false
                });
            },
            checkPickUp(){
                 this.$emit('pickUpShopDetail')
            },
            invite(){
                this.$emit('openShare','分享')
            }
        },
        watch:{
             State(val,oldVal){
                 if(val!==oldVal){
                     this.state=val;
                     this.initButtonGroups(val);
                 }
            },
            id(val,oldVal){
                if(val!==oldVal){
                   this.myId=val;
                }
            }
        },
        mounted(){

        },
        props:{
             id:{

             },
            State:{
                 type:Number,
            }
        }
    }
</script>
<style lang="scss" scoped>
    .buttonView{
        position: fixed;
        bottom: 0;
        padding:10px 10px;
        width: 355px;
        height: 30PX;
        background-color: white;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        .item{
            margin-left: 10px;
            @include reloadButton;
            @include radius(15px);
            padding:5px 20px;
            font-size: 14px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
        .invited{
            padding:5px 7.5px;
        }
    }
</style>