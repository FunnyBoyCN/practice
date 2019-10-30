<template>
    <div>
        <navbar :navbarTitle="'设置'"/>
        <main class="main" :style="{height:height+'px'}">
            <div class="item editPassword  padding paddingXLR flex row alignCenter spaceBetween" v-if="isLogin" @click.stop="$router.push('/editPassword')">
                <span>修改密码</span>
                <van-icon name="arrow" size="4vw"/>
            </div>
            <div class="item about  padding  paddingXLR flex row alignCenter spaceBetween">
                <span>关于我们</span>
                <van-icon name="arrow" size="4vw"/>
            </div>
            <div class="item logout marginTop padding paddingXLR flex row alignCenter justCenter" v-if="isLogin"  @click.stop="logout">
                <span>退出登录</span>
            </div>
        </main>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import {mapState} from 'vuex'
    import {Toast,Icon} from 'vant';
    import Vue from 'vue'
    Vue.use(Toast).use(Icon)
    export default{
        components:{
            navbar
        },
        data(){
            return{
                height:0
            }
        },
        computed:{
            ...mapState('user',['isLogin'])
        },
        mounted(){
            this.height=document.documentElement.clientHeight-56
        },
        methods:{
            logout(){
                this.$store.dispatch('user/logoutAction')
                this.$toast.success({
                    mask:true,
                    message:'已退出登录',
                    duration:800
                });
                const timer=setTimeout(()=>{
                    this.$router.go(-1);
                    clearTimeout(timer)
                },800)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main{
        background-color: $bg-color;

        padding-top: 10px;
        .item{
            background-color: white;
        }
    }
</style>