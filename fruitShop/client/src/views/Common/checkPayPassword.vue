<template>
    <div >
        <navbar :navbarTitle="'支付密码'"/>
        <div class="item animated" :class="[success?'success':'',error?'error shake':'']">
            <span class="title">{{title}}</span>
            <van-password-input
                    :value="oldPassword"
                    :info="!error?info:''"
                    :focused="showKeyboard"
                    @focus="showKeyboard = true"
                    class="input"
                    :error-info="error?info:''"
            />
        </div>
        <router-link v-show="isError" type="a" :to="{path:'/editPayPassword',query:{edit:true}}" class="padding forgotPassword">忘记密码</router-link>
        <van-number-keyboard
                :show="showKeyboard"
                @input="onInput"
                @delete="onDelete"
                @blur="showKeyboard = false"
        />
    </div>
</template>
<script>
    import Vue from 'vue';
    import {api} from '../../utils/api'
    import navbar from '../../components/navbar.vue'
    import { PasswordInput, NumberKeyboard } from 'vant';
    Vue.use(PasswordInput).use(NumberKeyboard);
    export default{
        components:{
            navbar
        },
        data(){
            return{
                oldPassword:'',
                showKeyboard:false,
                success:false,
                error:false,
                isError:false,
                info:'密码为 6 位数字',
                title:'请输入支付密码查看'
            }
        },
        methods: {
            onInput(key) {
                this.oldPassword = (this.oldPassword + key).slice(0, 6);
            },
            onDelete() {
                this.oldPassword = this.oldPassword.slice(0, this.oldPassword.length - 1);
            }
        },
        watch:{
            oldPassword(){
                if(this.oldPassword.length==6){
                    api.post('/checkPayPassword',{password:Number(this.oldPassword),_slient:true}).then(res=>{
                        this.success=true;
                        this.info=res.message;
                        const timer=setTimeout(()=>{
                            this.$store.commit('firstCheck/changeFirst');
                            this.$router.replace({
                                path:this.$route.query.toPath,
                            });
                            clearTimeout(timer);
                        },800)
                    },err=>{
                        this.isError=true;
                        this.error=true;
                        this.info=err.response.data.data.message;
                    })
                }else {
                    this.error=false;
                    this.success=false;
                    this.info='密码为 6 位数字';
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .item{
        margin-top: 15px;
        background:white;
        .title{
            position: relative;
            padding:10px 10px;
            display: block;
            width: 355px;
            color: $text-color;
        }
        .input{
            margin-top: 10px;
            li::after{
                border-color: $text-color;
            }
        }
        .input::after{
            border-color: $text-color;
        }

        .title:after{
            position: absolute;
            content: '';
            top:50%;
            right: 0;
            height: 1px;
            width: 205px;
            background-color: $main-color;
        }
    }
    .forgotPassword{
        display: inline-block;
    }
    .success{
        background-color: rgba(173, 255, 47, 0.26);
    }
    .error{
        background-color: rgba(255, 0, 0, 0.26);
    }
    .warming{
        background-color: rgba(255, 0, 0, 0.15);
    }
</style>