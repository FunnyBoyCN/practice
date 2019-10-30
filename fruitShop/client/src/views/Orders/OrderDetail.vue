<template>
    <div class="orderDetailView">
        <navbar :navbarTitle="'订单详情'" />
        <main class="mainView">
            <router-view  v-if="isOrderAlive"/>
        </main>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import {mapState} from 'vuex'
    export default{
        components:{
            navbar
        },
        data(){
            return{
                isOrderAlive:true,
            }
        },
        provide(){
            return{
                orderReload:this.orderReload
            }
        },
        methods:{
            orderReload(){
                this.isOrderAlive=false;
                this.$nextTick(function () {
                    this.isOrderAlive=true;
                })
            }
        },
        computed:{
            ...mapState('orderDetailName',['name'])
        },
        mounted(){
           const id=this.$route.query.id;
           console.log(this.name);
           this.$router.replace(`/Orders/OrderDetail/${this.name}Detail?id=${id}`)
        },
    }
</script>
<style lang="scss" scoped>
    .orderDetailView{
        background-color: $bg-color;
        .mainView{
            padding-bottom: 100px;
        }
    }

</style>