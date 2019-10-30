<template>
    <div>
        <van-overlay
                :show="true"
        />
    </div>
</template>
<script>
    import Vue from 'vue'
    import  {Overlay,Dialog}   from 'vant'
    Vue.use(Overlay).use(Dialog)
    export default{
        mounted(){
            const tokenOverdue=this.$route.query.tokenOverdue;
            const message=this.$route.query.message;
            Dialog.confirm({
                title: '提示',
                message: tokenOverdue?message:'您还未登录',
                cancelButtonText:'随便看看',
                confirmButtonText:'立即登录',
                confirmButtonColor:'#19a251'
            }).then(() => {
                if(tokenOverdue){
                    this.$router.replace({
                        path:'/Login',
                        query:{
                            tokenOverdue,
                        }
                    })
                }else {
                    this.$router.replace('/Login')
                }
            }).catch(() => {
                this.$router.replace('/')
            });
        }
    }
</script>