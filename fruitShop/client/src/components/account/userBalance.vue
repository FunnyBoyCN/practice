<template>
    <div class="show">
        <div class="top flex row flexEnd padding">
            <router-link class="checkBalance"  v-if="!isDetail" :to="{path:'/account/balanceDetail',query:{userId:userInfo.id}}">
                <span>查看余额消费明细</span>
                <van-icon name="arrow" size="12px" color="white"/>
            </router-link>
        </div>
        <div class="price">
            <div class="userBalance">
                <span class="symbol">￥</span>
                <span class="num">{{balance}}</span>
            </div>
            <div class="nowBalance" v-if="isDetail">
                <van-icon name="balance-pay" size="16px" color="white"/>
                <span>当前余额</span>
            </div>
        </div>
        <svg class="editorial"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink"
             viewBox="0 24 150 28"
             preserveAspectRatio="none">
            <defs>
                <path id="gentle-wave"
                      d="M-100 44c30 0
                            58-18 88-18s
                            58 18 88 18
                            58-18 88-18
                            58 18 88 18
                            v44h-352z" />
            </defs>
            <g class="parallax">
                <use xlink:href="#gentle-wave" x="50" y="0" fill="rgba(255,255,255,0.4)"/>
                <use xlink:href="#gentle-wave" x="100" y="8" fill="rgba(255,255,255,0.25)"/>
                <use xlink:href="#gentle-wave" x="150" y="8" fill="rgba(255,255,255,0.45)"/>
            </g>
        </svg>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Icon} from 'vant'
    import {mapState} from 'vuex'
    import {api} from '../../utils/api'
    Vue.use(Icon)
    export default{
       props:{
           isDetail:{
               type:Boolean,
               default:false
           }
       },
        data(){
           return{
               balance:0
           }
        },
        async mounted(){
            const data=await api.get(`/accounts`);
            this.balance=data.result.balance;
        },
        computed:{
            ...mapState('user',['userInfo'])
        }
    }
</script>
<style lang="scss" scoped>
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
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .userBalance{
                display: flex;
                flex-direction: row;
                align-items: center;
                .symbol{
                    font-size: 32px;
                    font-weight: 100;
                }
                .num{
                    font-size:42px;
                }
            }
            .nowBalance{
                display: flex;
                flex-direction: row;
                font-size: 12px;
                width: 70px;
                justify-content: space-between;
                margin-left: 25px;
                align-items: center;
            }
        }
    }
</style>