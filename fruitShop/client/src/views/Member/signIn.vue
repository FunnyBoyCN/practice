<template>
    <div>
        <div class="signInView" :style="{height}"></div>
        <navbar :navbarTitle="'签到'"/>
        <div class="bg"/>
        <div class="main">
            <div class="headerMs">
                <div class="myIntegral">我的积分：{{accountIntegral}}</div>
            </div>
            <div class="signInButton" v-if="!signed">
                <button class="signIn" @click.stop="signIn">签到</button>
            </div>
            <div class="signInDate">
                 <ul class="date">
                      <li v-for="(item,index) in signDate" class="item">
                             <div class="integral" :class="item.isSign?'isSign':''" >
                                 <van-icon name="success" color="white" size="18px" v-if="item.isSign"/>
                                 <span v-if="!item.isSign">+{{item.integral}}</span>
                             </div>
                             <div class="nowDate">{{item.date}}</div>
                       </li>
                 </ul>
                <div class="countIntegral">
                    <div class="countNumber">
                        <span class="number">{{countIntegral}}</span>
                        <span class="text" ref="text">积分</span>
                    </div>
                    <div class="countDay">
                        <div class="day">
                            <div>当前累计获得积分</div>
                            <div class="alreadyDay">已累计签到<span class="dayNumber">{{countDays}}</span>天</div>
                        </div>
                        <div class="rule" @click.stop="openRules=true">
                            <div>活动规则</div>
                            <van-icon name="question-o" class="icon"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="rules" v-show="openRules" >
            <div class="rulesContent">
                <van-icon name="cross" size="20px" color="#7a7a7a" class="rulesClose" @click.stop="openRules=false"/>
                <div class="title">规则说明</div>
                <ul>
                    <li v-for="(item,index) in rules">{{index+1}} . {{item}}</li>
                </ul>
            </div>
        </div>
        <div class="award"  v-show="openAward">
            <div class="awardContent">
                 <div class="tip">签到成功</div>
                 <div class="showAward">
                    <div class="icon">
                        <div class="realIcon"/>
                        <div class="backIcon"></div>
                    </div>
                     <div class="integral">
                         积分+{{nowIntegral}}
                     </div>
                 </div>
                 <button class="saveAward" @click.stop="saveAward">收下奖励</button>
            </div>
        </div>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import Vue from 'vue'
    import {api} from '../../utils/api'
    import {Icon,Toast} from 'vant'
    import axios from 'axios'
    Vue.use(Icon).use(Toast);
export default{
     components:{
         navbar
     },
    data(){
         return{
             signDate:[],
             signed:false,
             countDays:0,
             accountIntegral:0,
             countIntegral:0,
             height:0,
             openRules:false,
             openAward:false,
             nowIntegral:5,
             rules:['签到第1天送5积分，连续签到第二天送6积分，以此类推，连续签到第7天可一共获得56积分。第8天签到则重新开始一个七天轮回，视为首日签到；若签到中断则重新计算；','积分可在积分明细中查看']
         }
    },
    inject:['reload'],
    methods:{
        createdDate(time){
           let date=new Date(time);
           return {
               month:date.getMonth()+1,
               day:date.getDate(),
           }
        },
        checkSigned(timeArray){
            let now=new Date();
            let thisYear=now.getFullYear();
            let thisMonth=now.getMonth()+1;
            let today=now.getDate();
            for(let i=0;i<timeArray.length;i++){
                let res=this.changeDate(Number(timeArray[i]));
                if(res.year==thisYear&&res.month==thisMonth&&res.day==today){
                    this.signed=true;
                    break;
                }else {
                    this.signed=false;
                }
            }
        },
        changeDate(time){
             const date=new Date(time);
             let year=date.getFullYear();
             let month=date.getMonth()+1;
             let day=date.getDate();
            return{
                    year,
                    month,
                    day
                }
        },
        createdDateArray(resultArray){
            return new Promise((resolve)=>{
                if(resultArray.length!==0){
                    let start=5;
                    for(let i=0;i<resultArray.length;i++){
                        let now=new Date(Number(resultArray[i]));
                        let date=`${now.getMonth()+1}.${now.getDate()}`;
                        this.signDate.push({
                            date,
                            integral:start,
                            isSign:true
                        });
                        start=start+1;
                    }
                    for(let j=1;j<=7-resultArray.length;j++){
                        let lastNow=Number(resultArray[resultArray.length-1]);
                        this.signDate.push({
                            date:`${this.createdDate((lastNow+(60*60*1000*24*j))).month}.${this.createdDate((lastNow+(60*60*1000*24*j))).day}`,
                            integral:start,
                            isSign:false
                        });
                        start=start+1;
                    }
                }else {
                    let now=Date.now();
                    let startIntegral=5;
                    let date=new Date(now);
                    this.signDate.push({
                        date:`${date.getMonth()+1}.${date.getDate()}`,
                        integral:startIntegral,
                        isSign:false
                    });
                    for(let i=1;i<7;i++){
                        let next=now+(1000*60*60*24*i);
                        let date=new Date(next);
                        startIntegral+=1;
                        this.signDate.push({
                            date:`${date.getMonth()+1}.${date.getDate()}`,
                            integral:startIntegral,
                            isSign:false
                        });
                    }
                }
                resolve(this.signDate)
            })
        },
        getSignIn(){
            return api.get('/signIn')
        },
        getIntegral(){
            return  api.get('/integral')
        },
        signIn(){
          let now=Date.now();
          api.post('/signIn',{date:now},{_slient:true}).then(res=>{
              Toast.success({
                  message:res.message,
                  duration:800
              });
              let length=res.result[0].date.length;
              let start=5;
              for(let i=1;i<length;i++){
                  start=start+1;
              }
              this.nowIntegral=start;
              this.openAward=true;
          }).catch(err=>{
              Toast.fail({
                  message:err.response.data.message
              });
          })
        },
        init(){
            axios.all([this.getSignIn(),this.getIntegral()]).then(axios.spread((result1,result2)=>{
                this.checkSigned(result1.result.date);
                this.countDays=result1.result.date.length;
                this.countIntegral=result1.result.accountIntegral;
                let ratio=(document.documentElement.clientWidth)/100;
                if(this.countIntegral>10){
                    this.$refs.text.style.marginLeft=43/ratio+'vw'
                }else {
                    this.$refs.text.style.marginLeft=25/ratio+'vw'
                }
                this.accountIntegral=result2.result.integral;
                return this.createdDateArray(result1.result.date);
            }));
        },
        saveAward(){
            this.openAward=false;
            this.reload();
        }
    },
    mounted(){
       this.init();
       this.height=document.documentElement.clientHeight+'px';
    }
}
</script>
<style lang="scss" scoped>
    .signInView{
        position: fixed;
        top:0;
        left: 0;
        width: 375px;
        background-color: $bg-color;
         z-index: -2;
    }
    .bg{
        position: fixed;
        top:0;
        left: -52.5px;
        background-color: $main-color;
        width: 480px;
        height: 250px;
        @include radius(0 0 60% 60%);
        z-index: -1;
    }
    .main{
        padding-left: 20px;
        padding-right:20px;
        margin: 0;
        .headerMs{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            padding-top: 10px;
            padding-bottom: 10px;
            font-size: 14px;
            color: white;
        }
        .signInButton{
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 80px;
            padding-bottom: 10px;
            .signIn{
                @include reloadButton;
                @include radius(50%);
                background: linear-gradient(135deg,#FCE64C,#FCDF46,#FBCF38);
                color: #9a6e3a;
                height: 70px;
                width: 70px;
            }
        }
        .signInDate{
            width: 295px;
            height: 250px;
            @include radius(8px);
            padding: 20px 20px;
            background-color: white;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .date{
                padding-top: 10px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                list-style-type: none;
                margin: 0;
                .item{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .integral{
                        position: relative;
                        background-color: #F5F6F8;
                        color: $text-color;
                        @include radius(50%);
                        width: 29px;
                        height: 29px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        font-size: 12px;
                    }
                    .integral:before{
                        content: '';
                        position: absolute;
                        left: -15.5px;
                        top:50%;
                        margin-top: -1.5px;
                        width: 15.5px;
                        height: 3px;
                        background-color: #F5F6F8;
                    }
                    .isSign{
                       background-color: #ffcf41;
                    }
                    .isSign:before{
                        background-color:#ffd32d;
                    }
                    .nowDate{
                        margin-top: 10px;
                        font-size: 12px;
                        color: $text-color;
                    }
                }
                .item:first-child .integral:before{
                    height: 0;
                }

            }
            .countIntegral{
                display: flex;
                flex-direction: column;
                .countNumber{
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    height: 55px;
                    .text{
                        position: absolute;
                        bottom: 0;
                       align-self: flex-end;
                    }
                    .number{
                        position: absolute;
                        bottom: -7px;
                        font-weight: 400;
                        font-size: 35px;
                    }
                }
                .countDay{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin-top: 10px;
                    font-size: 12px;
                    color: $text-color;
                    .day{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        .alreadyDay{
                            position: relative;
                            margin-left: 8px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            .dayNumber{
                                font-weight: 500;
                                color: black;
                                font-size: 18px;
                                margin: 0 3px;
                                display: inline-block;
                            }
                        }
                        .alreadyDay:before{
                            position: absolute;
                            content: '';
                            left: -4px;
                            top:50%;
                            margin-top: -6px;
                            width: 1px;
                            height: 12px;
                            background-color:$text-color;
                        }
                    }
                    .rule{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        .icon{
                            margin-left: 5px;
                        }
                    }
                }

            }
        }
    }
    .rules{
        position: fixed;
        top:0;
        left:0;
        width: 375px;
        height: 100vh;
        background-color: rgba(0,0,0,0.68);
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .rulesContent{
            position: relative;
            width: 315px;
            height: 200px;
            @include radius(8px);
            background-color: white;
            display: flex;
            flex-direction: column;
            .rulesClose{
                position: absolute;
                right: 10px;
                top:15px;
            }
            .title{
                width: 100px;
                text-align: center;
                font-size: 18px;
                font-weight: 600;
                margin: 20px auto 10px auto;
            }
            ul{
                height: 120px;
                padding:0 15px;
                li{
                    margin-top: 10px;
                    font-size: 14px;
                    width: 285px;
                    text-align: justify;
                }
            }
        }

    }
    .award{
        position: fixed;
        top:0;
        left:0;
        width: 375px;
        height: 100vh;
        background-color: rgba(0,0,0,0.68);
        z-index: 2;
        .tip{
            text-align: center;
        }
        .awardContent{
            position: absolute;
            width: 285px;
            height: 285px;
            padding:15px 15px;
            top:50%;
            left: 50%;
            margin-top: -150px;
            margin-left: -157.5px;
            background-color: white;
            @include radius(8px);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .showAward{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                .realIcon{
                    width: 75px;
                    height: 75px;
                    @include radius(50%);
                    background-color: #ffce3a;
                    position: relative;
                    border:5px solid white;
                    z-index: 3;
                }
                .backIcon{
                    position: absolute;
                    background-color: yellow;
                    @include radius(50%);
                    width: 75px;
                    height: 75px;
                    top:50%;
                    margin-top: -56.25px;
                    margin-left: 20px;
                    z-index: 2;
                }
                .realIcon:before{
                    position: absolute;
                    content: '\00A5';
                    left:50%;
                    top:50%;
                    margin-left: -18.5px;
                    margin-top: -39.5px;
                    color: white;
                    font-size: 60px;
                    font-weight: bold;
                }
            }
            .integral{
                margin-top: 15px;
                font-size: 16px;
                font-weight: 500;
                text-align: center;
            }
            .saveAward{
                @include reloadButton;
                @include radius(30px);
                border:2px solid $main-color;
                color: $main-color;
                padding:10px ;
                background-color: white;
            }
        }
     }
</style>