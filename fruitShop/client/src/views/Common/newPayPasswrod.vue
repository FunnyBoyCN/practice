<template>
    <div class="newPasswordView">
        <div class="item " :class="success?'success':''">
            <span class="title">{{title}}</span>
            <van-password-input
                    :value="newPassword"
                    :info="info"
                    :focused="showKeyboard"
                    @focus="showKeyboard = true"
                    class="input"
            />
        </div>
        <van-number-keyboard
                :show="showKeyboard"
                @input="onInput"
                @delete="onDelete"
                @blur="showKeyboard = false"
        />
    </div>
</template>
<script>
    import {api} from '../../utils/api'
    import Vue from 'vue';
    import { PasswordInput, NumberKeyboard } from 'vant';
    Vue.use(PasswordInput).use(NumberKeyboard);
    export default{
        data(){
            return{
                newPassword:'',
                showKeyboard:false,
                success:false,
                info:'密码为 6 位数字',
                title:'修改密码'
            }
        },
        methods: {
            onInput(key) {
                this.newPassword = (this.newPassword + key).slice(0, 6);
            },
            onDelete() {
                this.newPassword = this.newPassword.slice(0, this.newPassword.length - 1);
            }
        },
        mounted(){
           const edit=this.$route.query.edit;
           if(!edit){
               this.title='创建密码'
           }
        },
        watch:{
           async newPassword(){
                if(this.newPassword.length==6){
                    api.post('/createPayPassword',{password:Number(this.newPassword),_slient:true}).then(res=>{
                        this.success=true;
                        this.info=res.message;
                        const toAccount=this.$route.query.toAccount;
                        const timer=setTimeout(()=>{
                            if(toAccount){
                                this.$router.replace('/account');
                            }else {
                                this.$router.go(-1);
                            }
                            clearTimeout(timer)
                        },800)
                    },err=>{
                        api.post('/editPayPassword',{password:Number(this.newPassword)}).then(res=>{
                            this.success=true;
                            this.info=res.message;
                            const timer=setTimeout(()=>{
                                this.$router.go(-1);
                                clearTimeout(timer)
                            },800)
                        })
                    })
                }else {
                    this.success=false;
                    this.info='密码为 6 位数字';
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .newPasswordView{
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
                width: 297px;
                background-color: $main-color;
            }
        }
        .success{
            background-color: rgba(173, 255, 47, 0.26);
        }
        .error{
            background-color: rgba(255, 0, 0, 0.26);
        }
    }

</style>