<template>
   <div class="orderMs flex row flexEnd component">
            <div class="flex column alignEnd">
                <div class="totalFee flex row alignCenter">
                    <span>支付总额：</span>
                    <price-view :big="22" :color="'#ed9400'" :small="18" :text="totalPrice" :isEnd="true" :beforeSize="22" class="goodsPrice"/>
                </div>
                <div class="notImportant createdTime">
                    <span>创建时间：</span>
                    <span>{{createdTime}}</span>
                </div>
                <div class="notImportant OrderNum" v-if="myorderNum!==0">
                    <span>订单编号：</span>
                    <span>{{myorderNum}}</span>
                </div>
                <div class="notImportant orderPayTime" v-if="state==1||state==-1">
                    <span v-if="!isCollage">{{state==1?'支付时间':''}}{{state==-1?'取消时间':''}}：</span>
                    <span v-if="isCollage&&state==-1">{{state==-1?'取消时间':''}}：<span>{{cancelTime}}</span></span>
                    <span v-if="!isCollage">{{payTime}}</span>
                </div>
            </div>
        </div>
</template>
<script>
    import priceView from '../realPrice.vue'
    export default{
        props:['totalPrice','createdTime','orderNum','state','payTime','isCollage','cancelTime'],
        components:{
            priceView
        },
        data(){
            return{
                myorderNum:0
            }
        },
        watch:{
            orderNum(val,oldval){
                if(val!==oldval){
                    this.myorderNum=Number(this.orderNum);
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .component{
        padding-top: 10px ;
        padding-bottom: 10px;
    }
    .orderMs{
    .totalFee{
        font-size: 14px;
    }
    .createdTime{

    }
    .notImportant{
        font-size: 12px;
        color: $text-color;
        margin-top: 10px;
    }
    }
</style>