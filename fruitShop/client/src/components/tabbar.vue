<template>
    <div>
        <van-tabbar @change="change"  v-model="active" fixed active-color="#19A251" :safe-area-inset-bottom="true"  class="navbar" :z-index="999">
            <van-tabbar-item  name="/" >
                <span>纤果汇</span>
                <van-icon
                        slot="icon"
                        slot-scope="props"
                        :name="props.active ? 'shop' : 'shop-o'"
                        size="1.3rem"
                />
            </van-tabbar-item>
            <van-tabbar-item  name="/Collage" >
                <span>拼团</span>
                <van-icon
                        slot="icon"
                        slot-scope="props"
                        :name="props.active ? 'goods-collect' : 'goods-collect-o'"
                        size="1.3rem"
                />
            </van-tabbar-item>
            <van-tabbar-item  name="/Orders/timelyOrder" >
                <span>订单</span>
                <van-icon
                        slot="icon"
                        slot-scope="props"
                        :name="props.active ? 'bill' : 'bill-o'"
                        size="1.3rem"
                />
            </van-tabbar-item>
            <van-tabbar-item name="/Member" >
                <span>会员</span>
                <van-icon
                        slot="icon"
                        slot-scope="props"
                        :name="props.active ? 'vip-card' : 'vip-card-o'"
                        size="1.3rem"
                />
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    import {Tabbar,TabbarItem,Icon} from 'vant'
    import 'vant/lib/tab/style'
    import 'vant/lib/tabbar-item/style'
    import 'vant/lib/icon/style'
    import Vue from 'vue'
    import {mapState} from 'vuex'
    Vue.use(Tabbar).use(TabbarItem).use(Icon)
    export default {
        components:{

        },
        data() {
            return {
                active: '/'
            }
        },
        mounted(){
            window.addEventListener('load',()=>{
                const pathName=['/','/Collage','/Orders/timelyOrder','/Member'];
                for(let i=0;i<pathName.length;i++){
                    if(this.$route.fullPath.indexOf('Orders')!==-1){
                        this.$store.dispatch('tabbar/changeTabbarName','/Orders/timelyOrder');
                        this.active=this.name;
                    }
                    if(this.$route.fullPath==pathName[i]){
                        this.$store.dispatch('tabbar/changeTabbarName',pathName[i]);
                        this.active=this.name;
                    }
                }
            })
        },
        methods:{
            change(active){
                this.$router.replace(active);
            }
        },
        computed:{
            ...mapState('tabbar',['name'])
        },
        watch:{
            $route(to,from){
               const pathName=['/','/Collage','/Orders/timelyOrder','/Member'];
               for(let i=0;i<pathName.length;i++){
                    if(to.path==pathName[i]){
                        this.$store.dispatch('tabbar/changeTabbarName',pathName[i]);
                        this.active=this.name;
                    }
               }
            },
            name(){
                this.active=this.name;
            }
        }
    }
</script>
<style lang="scss" scoped>
 .navbar{
     height: 50px;
     font-size: 0;
 }
</style>