<template>
    <div>
       <nav-bar :navbarTitle="'修改密码'" />
       <main class=" input paddingXLR flex column">
           <div class=" topControl flex row flexEnd ">
               <van-icon class="border" :name="isHidden?'closed-eye':'eye'" size="5vw" @click.stop="isHidden=!isHidden"/>
           </div>
           <div class="item flex row alignCenter border padding marginTop " ref="oldPassword">
               <input :type="isHidden?'password':'text'" v-model="oldPassword" placeholder="请输入原先密码"/>
           </div>
           <div class="item flex row alignCenter border padding marginTop" ref="newPassword">
               <input :type="isHidden?'password':'text'" v-model="form.password"  placeholder="请输入新密码"/>
           </div>
           <div class="item flex row alignCenter border padding marginTop" ref="confirmPassword">
               <input :type="isHidden?'password':'text'" v-model="form.confirmPassword"  placeholder="请再次输入新密码"/>
           </div>
           <div class="errorMs paddingTB" v-show="errorText.length!==0">
               <div class="content flex row alignCenter">
                   <div class="icon flex row alignCenter justCenter">
                       <van-icon name="warning-o" size="4vw" color="white"/>
                   </div>
                   <div class="text marginFontLeft" >{{errorText}}</div>
               </div>
           </div>
           <div class="submit marginTop">
               <button class="reset padding" @click.stop="reset">重置</button>
               <button class="submitButton padding"  @click.stop="submit">确认修改</button>
           </div>
       </main>
    </div>
</template>
<script>
    import navBar from '../../components/navbar.vue'
    import {api} from '../../utils/api'
//    views
    import Vue from 'vue'
    import {Icon,Toast} from 'vant'
    Vue.use(Icon).use(Toast);
    export default{
        data(){
            return{
                isHidden:true,
                oldPassword:'',
                form:{
                    password:'',
                    confirmPassword:'',
                },
                errorText:'',
                level:0,
            }
        },
        methods:{
            reset(){
                this.oldPassword='';
                this.form={};
                this.errorText='';
            },
            submit(){
                if(this.oldPassword==''){
                    this.$refs.oldPassword.classList.add('borderError');
                    this.errorText='请先输入原密码';
                }else if(this.form.password==''){
                    this.$refs.newPassword.classList.add('borderError');
                    this.errorText='请输入新密码';
                }else if(this.form.password!=='') {
                    this.lengthCheck(this.form.password).then(res => {
                          if(res){
                              if(this.form.confirmPassword==''){
                                  this.$refs.confirmPassword.classList.add('borderError');
                                  this.errorText='请确认新密码';
                              }else {
                                  if(this.confirmCheck()){
                                      this.form.oldPassword=this.oldPassword;
                                      api.post('/editPassword',{form:this.form,_slient:true},).then(res=>{
                                          this.$router.go(-1);
                                          Toast.success(res.message)
                                      }).catch(err=>{
                                          Toast.fail(err.response.data.data.message)
                                      })
                                  }
                              }
                          }
                    })
                }
            },
            confirmCheck(){
                let result=true;
                if(this.form.password!==this.form.confirmPassword){
                    this.$refs.confirmPassword.classList.add('borderError');
                    this.errorText='两次输入的密码不一致';
                    result=false;
                }
                return result;
            },
            lengthCheck(val){
                return new Promise((resolve)=>{
                    let result=true;
                    const reg=new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/);
                    if(!reg.test(val)){
                        this.$refs.newPassword.classList.add('borderError');
                        this.errorText='密码至少8位包含大小字母以及数字';
                        this.form.password=='';
                        result=false;
                    }
                    resolve(result)
                })

            },
            errorReset(){
                this.$refs.oldPassword.classList.remove('borderError');
                this.$refs.newPassword.classList.remove('borderError');
                this.$refs.confirmPassword.classList.remove('borderError');
                this.errorText='';
                this.level=0;
            }
        },
        computed:{
          formInput(){
              return this.oldPassword+ this.form.confirmPassword + this.form.password
          }
        },
        watch:{
            formInput(){
               this.errorReset();
            }
        },
        mounted(){

        },
       components:{
           navBar
       }
    }
</script>
<style lang="scss" scoped>
    @mixin button{
        border: 0;
        outline: 0;
        width: 100%;
        @include radius(5px);
    }
    .input{
        padding-top: 50px;
        .item{
           input{
               flex-grow: 5;
               font-size: 18PX;
               border: 0;
           }
        }
        .errorMs{
            .icon{
                width: 15px;
                height: 15px;
                @include radius(50%);
                background-color: $main-color;
            }
            .text{
                font-size: 14px;
                color: $main-color;
            }
        }
      .submit{
          margin-top: 15px;
          .submitButton{
             @include button;
              background: $main-color;
              color: whitesmoke;
              margin-top: 20px;
          }
          .reset{
              @include button;
              background: $bg-color;
              color:$text-color;
          }
      }
        .borderError::after{
            content: '';
            background-color: red;
        }
    }

</style>