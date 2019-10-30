<template>
       <div>
           <navbar :navbarTitle="'会员码'" />
           <div class="memberCodeView" :style="{height}">
               <div class="mainView">
                    <div class="memberGrade">
                        <span>{{memberGrade.grade}}：</span>
                        <span>{{phoneShow(memberGrade.phone)}}</span>
                    </div>
                   <div class="memberAssets">
                       <div class="item" v-for="(item,index) in memberAssets" :key="index">
                           <span class="content">{{item.content}}</span>
                           <span class="text">{{item.text}}</span>
                       </div>
                   </div>
                   <div class="memberCode">
                       <div class="codeNumber">
                           <span>{{showNumber}}</span>
                           <span @click.stop="openCode=true" class="seeNumber" v-show="!openCode">查看数字</span>
                       </div>
                       <div class="barCode">
                           <svg  id="barcode"></svg>
                       </div>
                       <div class="tip">
                           <van-icon name="replay" size="14px" color="#a7a7a7"/>
                           <span>会员码每30秒自动更新，请在店内消费时使用</span>
                       </div>
                   </div>
               </div>
           </div>
       </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import JsBarCode from 'jsbarcode'
    import power from '../../utils/power'
    import {api} from '../../utils/api'
    import axios from 'axios'
    export default{
        components:{
            navbar
        },
        data(){
            return{
                height:0,
                memberGrade:{
                    phone:18689772300,
                    grade:'普卡会员'
                },
                memberAssets:[{
                    text:'积分',
                    content:0
                },{
                    text:'优惠卷',
                    content:0
                },{
                    text:'钱包·充值',
                    content:0
                }],
                openCode:false,
                codeNumber:'',
                showNumber:'',
                timer:'',
                account:0,
            }
        },
        computed:{
          phoneShow(){
              return function (text) {
                  let myPower=new power(text);
                  return myPower.shieldPhone()
              }
            }
        },
        mounted(){
            this.height=document.documentElement.clientHeight-46+'px';
            this.init();
            this.timer=setInterval(()=>{
                this.getMemberCode()
            },1000*30)
        },
        beforeDestroy(){
            clearInterval(this.timer);
        },
        methods:{
          init(){
            let promiseA=api.get('/memberCode');
            let promiseB=api.get('/accounts');
            let promiseC=api.get('/integral');
            axios.all([promiseA,promiseB,promiseC]).then(axios.spread((result1,result2,result3)=>{
                this.codeNumber=result1.result;
                let myPower=new power(result1.result);
                this.showNumber=myPower.shieldCodeNum();
                JsBarCode("#barcode").options({font: "OCR-B"}).CODE128(result1.result, { textMargin: 0,height:120,displayValue:false}).render();
                this.$set(this.memberAssets[2],'content',result2.result.balance);
                this.$set(this.memberAssets[0],'content',result3.result.integral);
            }))
          },
          getMemberCode(){
               api.get('/memberCode',{params:{noLoading:true}}).then(res=>{
                   this.codeNumber=res.result;
                   this.openCode=false;
                   let myPower=new power(res.result);
                   this.showNumber=myPower.shieldCodeNum();
                   JsBarCode("#barcode").options({font: "OCR-B"}).CODE128(res.result, { textMargin: 0,height:120,displayValue:false}).render();
               })
          }
        },
        watch:{
            openCode(){
                if(this.openCode){
                    this.showNumber=this.codeNumber;
                }else {
                    let power =new power(this.codeNumber);
                    this.codeNumber=power.shieldCodeNum();
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
      .memberCodeView{
          background-color: $main-color;
          width: 375px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .mainView{
              margin-top: 50px;
              width: 355px;
              height: 80%;
              background-color: white;
              @include radius(8px);
              display: flex;
              flex-direction: column;
              align-items: center;
              .memberGrade{
                  width: 50%;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  margin-top: 15px;
                  font-size: 14px;
              }
              .memberAssets{
                  width:100%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 40px;
                  .item{
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      width: 118.3px;
                      height: 55px;
                      position: relative;
                      .content{
                          font-size: 18px;
                          color: $main-color;
                      }
                      .text{
                          margin-top: 5px;
                          font-size: 12px;
                          color: $text-color;
                      }
                  }
                  .item:before{
                      position: absolute;
                      content: '';
                      left: 0;
                      top:50%;
                      width: 1px;
                      height: 32px;
                      margin-top: -16px;
                      background-color: $line-color;
                  }
                  .item:first-child:before{
                      height: 0;
                  }
              }
              .memberCode{
                  width: 100%;
                  margin-top: 25px;
                  .codeNumber{
                      margin: 0 auto;
                      width: 80%;
                      display: flex;
                      flex-direction: row;
                      justify-content: center;
                      align-items: center;
                      span{
                          height: 21PX;
                          line-height: 21PX;
                      }
                      .seeNumber{
                          margin-left: 5px;
                      }
                  }
                  .barCode{
                     max-width: 80%;
                      margin: 0 auto;
                     display: flex;
                      flex-direction: row;
                      justify-content: center;
                  }
                  .tip{
                      width: 80%;
                      margin: 0 auto;
                      color: #a7a7a7;
                      font-size: 12px;
                      display: flex;
                      flex-direction: row;
                      justify-content: center;
                      align-items: center;
                      span{
                          margin-left: 5px;
                      }
                  }
              }
          }
      }
</style>