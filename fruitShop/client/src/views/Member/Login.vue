<template>
    <div>
        <nav-bar :navbarTitle="'登陆'"/>
        <div class="padding flex column marginTop alignCenter">
            <div class="LoginIcon flex row justCenter alignCenter padding"><span>纤果汇</span></div>
            <div class="marginFontTop FontLarge">水果账号登录</div>
        </div>
        <main class="login paddingXLR">
            <div class="loginInput">
                <div class="item flex row alignCenter  border padding" ref="phone">
                   <div class="phoneArea flex row alignCenter">
                       <div class="area flex row alignCenter">
                           <transition name="slideLeft" appear>
                           <span>+86</span>
                           </transition>
                            <van-icon name="arrow"  size="16PX" color="#7a7a7a"></van-icon>
                       </div>
                   </div>
                    <div class="input flex row alignCenter">
                       <input placeholder="手机号码" v-model="formData.phone" type="number"  />
                        <van-icon v-show="formData.phone.length>0" name="close" size="5vw" color="#7a7a7a" class="closeButton marginFontRight" @click.stop="clear($event,'phone')"></van-icon>
                    </div>
                </div>
                <div class="item flex row alignCenter border padding" v-show="!isLoginType" ref="code">
                    <div class="input flex row alignCenter">
                        <input placeholder="短信验证码" v-model="formData.code"   type="number"/>
                        <van-icon v-show="formData.code.length>0" name="close" size="5vw" color="#7a7a7a" class="closeButton marginFontRight" @click.stop="clear($event,'code')"></van-icon>
                    </div>
                    <div class="phoneArea flex row alignCenter ">
                        <button class="sms"  @click="sendCode" :disabled="isCountTime" :style="isCountTime?'color:gray':'color:royalblue'">{{isSend?'重新发送':'获取验证码'}}{{isCountTime?countNumZero+countNum:''}}</button>
                        <div class="countTime"></div>
                    </div>
                </div>
                <div class="item flex row alignCenter border padding" v-show="isLoginType"  ref="password">
                    <div class="input flex row alignCenter">
                        <input placeholder="请输入密码" v-model="formData.password"   :type="isHidden?'password':'text'"   />
                         <van-icon  :name="isHidden?'closed-eye':'eye'"  class=" marginFontRight" @click.stop="isHidden=!isHidden"></van-icon>
                    </div>
                </div>
            </div>
            <div class="errorMs paddingTB" v-show="errorText.length!==0">
                <div class="content flex row alignCenter">
                    <div class="icon flex row alignCenter justCenter">
                        <van-icon name="warning-o" size="4vw" color="white"/>
                    </div>
                    <div class="text marginFontLeft" >{{errorText}}</div>
                </div>
            </div>
            <div class="submit flex column marginTop">
                <button class="submitButton marginTop padding" @click.stop="submit">{{isLoginType?'登录':'立即登录/注册'}}</button>
                <button class="passwordLogin marginTop padding" @click.stop="changeLogin">{{isLoginType?'手机短信登录/注册':'密码登录'}}</button>
            </div>
        </main>
    </div>
</template>
<script>
  import navBar from '../../components/navbar.vue'
  import {api} from '../../utils/api'
  import {Field,CellGroup,Icon,Toast,Notify,Dialog} from 'vant'
  import Vue from 'vue'
  Vue.use(Field).use(CellGroup).use(Icon).use(Toast).use(Notify).use(Dialog);
    export default{
      data(){
          return{
              isSend:false,
              isCountTime:false,
              isHidden:false,
              isLoginType:false,
              errorText:'',
              formData:{
                  phone:'',
                  code:'',
                  password:''
              },
              timer:'',
              countTimer:'',
              countNum:60,
              Code:'',
              userInfo:{

              }
          }
      },
      components:{
          navBar
      },
       methods:{
           clear(event,value){
             const child= Array.from(event.target.parentNode.childNodes);
             const input=child.filter(v=>{
                  if(v.toString().split(' ')[1].split(']')[0]=='HTMLInputElement'){
                      return v;
                  }
               });
               input[0].focus();
               this.$set(this.formData,value,'');
           },//清除按钮
          async sendCode(){
              const that=this;
              if(that.checkPhone()){
                 that.isSend=true;
                 that.Code=await api.post('/sms',{phone:that.formData.phone});
                  that.isCountTime=true;
                  that.countTimer=setInterval(function () {
                      that.countNum--;
                      if(that.countNum==0){
                          that.isCountTime=false;
                          that.countNum=60;
                          clearInterval(that.countTimer);
                      }
                  },1000);
              }
           },  //发送短信
           submit(){
            const result= this.checked();
            if(result){
                api.post('/login',this.formData).then(res=>{
                    this.$notify({
                        message: res.message,
                        duration: 500,
                        background: '#19A251'
                    })
                    this.$store.dispatch('user/loginAction',res.userInfo);
                    const that=this;
                    that.timer=setTimeout(()=>{
                        if(res.register){
                            Dialog.confirm({
                                title: '注册成功 您的初始密码为123',
                                message: '初始密码安全级别较低，是否立即修改密码？',
                                cancelButtonText:'稍后修改',
                                confirmButtonText:'现在就去',
                                confirmButtonColor:'#19A251'
                            }).then(() => {
                                that.$router.push('/editPassword')
                            }).catch(() => {
                                that.$router.push('/Member')
                            });
                        }else {
                            const tokenOverdue=this.$route.query.tokenOverdue;
                            tokenOverdue? that.$router.go(-1) :that.$router.push('/Member');
                        }
                        clearTimeout(that.timer)
                    },500);

                },err=>{
                    Toast.fail(err.response.data.data.message);
                });
            }
           },
           checked(){
               let result=false;
               if(this.checkPhone()){
                   if(this.isLoginType){
                       if(this.formData.password=='') {
                           this.$refs.password.classList.add('borderError');
                           this.errorText='请输入密码';
                       }else {
                           result=true
                       }
                   }else {
                       this.checkCode()?result=true: result=false;
                   }
               }
               return result;
           },
           tel(str){
               const reg=new RegExp(/^1[34578]\d{9}$/);
               return reg.test(str);
           },  //电话号码验证
           code(num){
              const reg=new RegExp(/^\d{6}$/);
              return reg.test(num)
           },//验证码验证
           checkPhone(){
                let result=false;
                const phone=this.formData.phone;
               if(phone==''){
                   this.$refs.phone.classList.add('borderError');
                   this.errorText='请输入手机号';
               }else if(!this.tel(phone)){
                   this.$refs.phone.classList.add('borderError');
                   this.errorText='请输入正确手机号';
               }else {
                   result=true;
               }
               return result;
           },
           checkCode(){
               let result=false;
               if(this.formData.code=='') {
                   this.$refs.code.classList.add('borderError');
                   this.errorText = '请输入验证码';
               }else if(!this.code(this.formData.code)){
                   this.$refs.code.classList.add('borderError');
                   this.errorText = '请输入正确验证码';
               }else {
                   result=true;
               }
               return result;
           },
           inputInit(){
               this.$refs.phone.classList.remove('borderError');
               this.$refs.code.classList.remove('borderError');
               this.$refs.password.classList.remove('borderError');
               this.errorText='';
           },
           changeLogin(){
               this.isLoginType=!this.isLoginType;
               this.errorText='';
               this.formData.password='';
           }
       },
        computed:{
            countNumZero(){
                return this.countNum<10?'0':''
            },
            form(){
                return this.formData.phone + this.formData.code + this.formData.password
            },

        },
        watch:{
            form(){
                 this.inputInit();
            }
        }
    }
</script>
<style lang="scss" scoped>
   .LoginIcon{
       width: 40px;
       height: 40px;
       align-items: center;
       justify-content: center;
       background-color: $main-color;
       @include radius(5px);
       span{
           font-weight:bold;
           font-size: 12px;
           color: white;
       }
   }
    .loginInput{
        .item{
            height: 45px;
            overflow-x: hidden;
            .phoneArea{
                flex-grow: 1;
                color: $text-color;
                font-size: 16px;
                .area{
                    overflow: hidden;
                    width: auto;
                    height: 19px;
                    .van-icon{
                        line-height: 19px;
                    }
                    span{

                        display: block;
                    }
                  }
            }
            .input{
                position: relative;
                flex-grow: 6;
                input{
                    flex-grow: 6;
                    height: 70%;
                    font-size: 18PX;
                    border: none;
                }
                .closeButton{
                    position: absolute;
                    right: 5px;
                    z-index: 999;
                }
            }
            .sms{
                min-width: 92px;
                background-color: transparent;
                border: none;
            }
        }
        .borderError::after{
            content: '';
            background-color: red;
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
        width: 100%;
         button{
             font-size: 16px;
         }
        .submitButton{
            border: 0;
            color: white;
            background-color: $main-color;
            @include radius(5px)
        }
        .passwordLogin{
            border: 1px solid $line-color;
            color: black;
            background-color: white;
            @include radius(5px)
        }
    }
    .slideLeft-enter-active{
         animation:slide-left 0.3s linear ;
    }
    @keyframes slide-left{
         from{
           transform: translateX(-35px);
         }
        to{
            transform: translateX(0px);
        }
    }
   ::-moz-placeholder { color: $text-color; }
   ::-webkit-input-placeholder { color:$text-color; }
   :-ms-input-placeholder { color:$text-color; }
</style>