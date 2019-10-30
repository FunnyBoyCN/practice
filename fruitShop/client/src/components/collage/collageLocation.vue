<template>
    <div class="orderAddress flex row spaceBetween padding ">
        <div class="left flex column spaceBetween">
            <span>提货门店：{{Shop.name}}</span>
            <span>{{Shop.address}}</span>
            <span>门店营业时间：{{Shop.openTime}}</span>
        </div>
        <div class="right">
            <div class="icon phone border" v-if="isOrder" @click.stop="call">
                <van-icon name="phone-circle-o" size="6vw"/>
            </div>
            <router-link class="icon position" v-if="isOrder" type="div" :to="{path:'/shopMapDetail',query:{id:Shop.id}}">
                <van-icon name="location-o" size="6vw" color="black"/>
            </router-link>
            <router-link class="icon" v-if="!isOrder" :to="{path:'/nearbyShop',query:{collageCheckout:true}}">
                <span>修改</span>
                <van-icon name="arrow" size="16px"/>
            </router-link>
        </div>
    </div>
</template>
<script>
    import {Icon} from 'vant'
    import {mapState} from 'vuex'
    import {api} from '../../utils/api'
    import Vue from 'vue'
    Vue.use(Icon);
    export default{
        data(){
            return{
                Shop:{}
            }
        },
         props:{
             isOrder:{
                 type:Boolean,
                 default:false,
             },
             shop:{
                 type:Object
             }
         },
        methods:{
            call(){
                let a=document.createElement(`a`);
                a.setAttribute('href',`tel:186-8977-2300`);
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .orderAddress{
        position: relative;
        background-color: white;
        .left{
            span{
                margin-top: 5px;
                font-size: 14px;
                color: $text-color;
            }
            span:first-child{
                font-size: 16px;
                margin: 0;
                color: black;
            }
        }
        .right{
            display: flex;
            flex-direction: column;
            justify-content: center;
            .icon{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width: 45px;
                height: 45px;
                span{
                    font-size: 14px;
                }
            }
            .border:after{
                width: 100%;
            }
        }
    }
    .orderAddress:after{
        @include addressLine;
    }
</style>