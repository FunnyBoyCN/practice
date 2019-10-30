<template>
    <div>
        <navbar navbarTitle="余额明细"/>
        <user-balance :isDetail="true"/>
        <div class="balanceDetail padding border" v-for="(item,index) in balanceDetail">
            <div class="desCreatedTime">
                <span class="desc">{{item.des}}</span>
                <span class="createdTime">{{item.createdTime}}</span>
            </div>
            <div class="amount" v-if="item.num!==0">{{item.num<0?`${item.num}`:`+${item.num}`}}</div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Icon} from 'vant'
    import {mapState} from 'vuex'
    import {api} from '../../utils/api'
    import power from '../../utils/power'
    Vue.use(Icon)
    import navbar from '../../components/navbar.vue'
    import userBalance from '../../components/account/userBalance.vue'
    export default{
        components:{
            navbar,
            userBalance
        },
        methods:{
          async init(){
               let myPower=new power();
               const data= await api.get(`/accountRecords`);
               this.balanceDetail=data.result;
               for(let i=0;i< this.balanceDetail.length;i++){
                   this.$set(this.balanceDetail[i],'createdTime',myPower.timeTrans(this.balanceDetail[i].createdTime))
               }
           }
        },
        data(){
            return{
                balanceDetail:[]
            }
        },
        async mounted(){
           this.init();
        }
    }
</script>
<style lang="scss" scoped>
    .balanceDetail{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .desCreatedTime{
            display: flex;
            flex-direction: column;
            .createdTime{
                margin-top: 5px;
                font-size: 12px;
                color: $text-color;
            }
        }
        .amount{
            font-size: 18px;
            color: #ed9400;
        }
    }
</style>