<template>
    <div class="view">
        <div class="fixed">
            <title-view :text="'订单'"/>
            <van-tabs v-model="active" swipeable  @click="tabClick" color="#19a251">
                <van-tab v-for="(item,index) in orderList" :name="item.content" :title="item.title" :key="index">

                </van-tab>
            </van-tabs>
        </div>
        <div class="orderPadding">
             <router-view />
        </div>
    </div>
</template>
<script>
    import titleView from '../../components/title.vue'
    import Vue from 'vue';
    import { Tab, Tabs } from 'vant';
    Vue.use(Tab).use(Tabs);
    export default{
        components:{
            titleView
        },
        methods:{
            tabClick(name) {
                 this.$router.push(`/Orders/${name}`)
            },
        },
        mounted(){
           const orderMode=this.$route.query.orderMode;
           if( orderMode){
               this.$router.push(`/Orders/${orderMode}`);
               this.active=orderMode;
           } else {
               this.$router.push(`/Orders/timelyOrder`)
           }
        },
        data(){
            return{
                active:'timelyOrder',
                orderList:[{
                    title:'及时达',
                    content:'timelyOrder'
                },{
                    title:'拼团',
                    content:'collageOrder'
                }
                ],
            }
        },

    }
</script>
<style lang="scss" scoped>
    .view{
        .fixed{
            position: fixed;
            top:0;
            width: 100%;
            z-index: 10;
        }
        background-color: $bg-color;
        .orderPadding{
            padding-top: 90px;
            padding-bottom: 50PX;
        }

    }

</style>