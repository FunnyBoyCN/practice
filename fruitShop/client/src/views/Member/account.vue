<template>
    <div>
         <navbar :navbarTitle="'我的账户'"/>
        <div class="accountView " :class="keyBoardShow?'popView':''">
            <user-balance/>
            <div class="priceAmount">
                <div class="item "  :class="item.active?'active':''"  v-for="(item,index) in priceAmount" :key="item.amount" @click="chooseAmount(item)">
                    <span class="amount">{{item.amount}}</span>
                    <span class="givingAmount" v-if="!item.isShowIcon">送{{item.givingAmount}}元</span>
                    <van-icon v-if="item.isShowIcon" name="arrow-down" size="14px" />
                </div>
                <div class="otherAmount " v-show="show">
                    <input type="Number" @focus="focus"  placeholder="请输入充值金额，最低1元" v-model="otherAmount" @click="openKeyBoard"/>
                    <button class="otherAmountTopUp" @click="topUp" :class="chooseNum==0?'notAllow':''" :disabled="chooseNum==0">立即充值</button>
                </div>
            </div>
            <button class="topUp" :class="chooseNum==0?'notAllow':''" :disabled="chooseNum==0" v-show="!show" @click="topUp">立即充值</button>
        </div>
        <van-number-keyboard
                :show="keyBoardShow"
                extra-key=" "
                close-button-text="完成"
                v-model="otherAmount"
                @close="keyBoardShow=false"
        >
            <template slot="delete" >
                <div class="delete flex row alignCenter justCenter">
                    <svg t="1567589838439" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3769" width="36" height="36"><path d="M869.376 265.216H349.696c-17.408 0-33.792 7.168-46.08 19.968L102.912 498.688c-22.528 24.064-22.528 61.952 0 86.016L304.128 798.72c11.776 12.8 28.672 19.968 46.08 19.968h519.68c34.816 0 62.976-28.16 62.976-62.976V328.192c-0.512-34.816-28.672-62.976-63.488-62.976z m11.776 490.496c0 6.656-5.12 11.776-11.776 11.776H349.696c-3.072 0-6.144-1.536-8.704-3.584l-200.704-214.016c-4.096-4.608-4.096-11.776 0-15.872l200.704-214.016c2.048-2.56 5.12-3.584 8.704-3.584h519.68c6.656 0 11.776 5.12 11.776 11.776v427.52z" p-id="3770" fill="#7a7a7a"></path><path d="M713.728 384l-121.856 121.856L470.016 384l-36.352 35.84 121.856 121.856-121.856 121.856 36.352 36.352 121.856-121.856 121.856 121.856 35.84-36.352-121.344-121.856L749.568 419.84z" p-id="3771" fill="#7a7a7a">
                    </path>
                    </svg>
                </div>
            </template>
        </van-number-keyboard>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import userBalance from '../../components/account/userBalance.vue'
    import {api} from '../../utils/api'
    import {mapState} from 'vuex'
    import Vue from 'vue'
    import  {Icon,NumberKeyboard} from 'vant'
    Vue.use(Icon).use(NumberKeyboard);
     export default{
         components:{
             navbar,
             userBalance
         },
         inject:['reload'],
         data(){
             return{
                 otherAmount:'',
                 show:false,
                 keyBoardShow:false,
                 priceAmount:[{
                     amount:'300元',
                     givingAmount:'15.00',
                     active:false,
                     num:315,
                 },{
                     amount:'500元',
                     givingAmount:'35.00',
                     active:false,
                     num:535,
                 },{
                     amount:'1000元',
                     givingAmount:'80.00',
                     active:false,
                     num:1080,
                 },{
                     amount:'其他金额',
                     isShowIcon:true,
                     active:false,
                     num:this.otherAmount,
                 }],
                 chooseNum:0,
             }
         },
        async mounted(){

         },
         methods:{
             openKeyBoard(){
                 this.keyBoardShow=true;
             },
             focus(){
                 document.activeElement.blur();
             },
             chooseAmount(item){
                 if(item.amount!=='其他金额'){
                     this.keyBoardShow=false;
                 }
                 if(item.active){
                     if(item.amount=='其他金额'){
                         this.show=false;
                     }
                     this.$set(item,'active',false);
                     this.chooseNum=0;
                 }else {
                     if(item.amount=='其他金额'){
                         this.show=true;
                         this.chooseNum=this.otherAmount;
                     }else {
                         this.chooseNum=item.num;
                         this.show=false;
                     }
                     this.$set(item,'active',true);
                     this.priceAmount.forEach(v=>{
                         if(v!==item){
                             this.$set(v,'active',false);
                         }
                     })
                 }
             },
            async topUp(){
                 const data={
                     balance:this.chooseNum,
                     desc:'账户充值'
                 };
                 const result=await api.post(`/editAccounts`,data);
                 this.Notify({type:'success', message:result.message});
                 this.reload();
             }
         },
         watch:{
             otherAmount(){
                 this.chooseNum=Number(this.otherAmount)
             }
         }
     }
</script>
<style lang="scss" scoped>
    .accountView{
        background-color: white;
        .show{
            height: 150px;
            width: 100%;
            background-color: $main-color;
            position: relative;
            margin-top: 10px;
            .editorial {
                display: block;
                width: 100%;
                height: 45px;
                margin: 0;
                position: absolute;
                bottom: 0;
            }
            .checkBalance{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 12px;
                .van-icon{
                    margin-left: 5px;
                }
            }
            .price{
               position: absolute;
                top:50%;
                left: 50%;
                @include transformXY(-50%,-50%);
                color: white;
                font-weight: 300;
                .symbol{
                    font-size: 32px;
                    font-weight: 100;
                }
                .num{
                    font-size:48px;
                }
            }
        }
        .priceAmount{
            padding:10px 10px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .item{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding:10px 15px;
                width: 79.6px;
                margin-top: 10px;
                margin-right: 10px;
                border: 1px solid $line-color;
                @include radius(5px);
                .amount{
                    font-weight: bold;
                }
                .givingAmount{
                    height: 19px;
                    font-size: 14px;
                    color: $text-color;
                }
                .van-icon{
                    color: $line-color;
                }
            }
            .item:nth-child(3n){
                margin-right: 0;
            }
            .otherAmount{
                position: relative;
                margin-top: 15px;
                width: 355px;
                height: 45px;
                @include radius(5px);
                border: 1px solid $main-color;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 10px 10px;
                background-color: $bg-color;
                input{
                   background-color: white;
                    border: 0;
                    outline: 0;
                    font-size: 16px;
                    width: 75%;
                    height: 75%;
                }
                .otherAmountTopUp{
                    @include reloadButton;
                    width: 25%;
                    height: 75%;
                    text-align: center;
                    background-color: $main-color;
                    color: white;
                }
                .notAllow{
                    background-color: #a2a2a2;
                    color: $bg-color;
                    opacity: 0.6;
                }
            }
            .otherAmount:before{
                 content: '';
                 position: absolute;
                 width: 0;
                 top:-20px;
                 left: 45.8px;
                 border-width: 10px;
                 border-color: transparent transparent $main-color transparent;
                 border-style: solid;
             }
            .otherAmount:after{
                content: '';
                position: absolute;
                width: 0;
                border-width: 10px;
                top:-19px;
                left: 45.8px;
                border-color: transparent transparent $bg-color transparent;
                border-style: solid;
            }
            .active{
                color: $main-color;
                border-color: $main-color;
                background-color: rgba(25,162,81,0.2);
                .givingAmount{
                    color:  $main-color;
                }
                .van-icon{
                    color: $main-color;
                }
            }
        }
        .topUp{
            @include reloadButton;
            position: fixed;
            bottom: 0;
            height: 50px;
            width: 100%;
            padding:10px 0;
            background-color: $main-color;
            color: white;
        }
       .notAllow{
           background-color: #a2a2a2;
           color: $bg-color;
           opacity: 0.6;
       }
    }
    .popView{
        position: absolute;
        bottom: 246px;
        width: 100%;
        left: 0;
    }
    .delete{
        height: 100%;
    }

</style>