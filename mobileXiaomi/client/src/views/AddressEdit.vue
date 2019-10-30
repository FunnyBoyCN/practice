<template>
    <div class="paddingBottom" >
        <back-nav title="地址编辑"></back-nav>
        <div class="titleTip normalFont padding InfoColor" :class="isFixedClass" v-if="userAddMs.length>0">单击选择，右侧编辑</div>
        <div class="addressArea" :class="contentClass" id="addressArea" v-if="userAddMs.length>0">
             <div class="item padding rowFlex bgWhite" v-for="(val,index) in userAddMs" @click="chooseAddress(val.address_id)">
                 <van-icon
                         :name="val.address_id===chooseAddId?'passed':'circle'"
                         size="1.5rem"
                         :color="val.address_id===chooseAddId?'white':'black'"
                         style="border-radius: 50%"
                         :class="val.address_id===chooseAddId?'ChooseClass':'notChoose'"
                 />
                 <div class="AddArea">
                     <div class="MaxFont fontBold">{{val.recipient}}，{{val.phone.slice(0,3)}}****{{val.phone.slice(7,11)}}</div>
                     <div class="normalFont MiniMarginTop">{{val.address}} {{val.area}}</div>
                 </div>
                 <van-icon name="edit" size="1.5rem" color="#7a7a7a" @click.stop="editAddress(val)" class="editBtn"/>
             </div>
        </div>
        <div class="addNewBtn padding MaxFont" @click="addNewAddress">
            添加新地址
        </div>
        <van-popup v-model="isOpenModal" position="right" :overlay="false" transition  class="fontSize">
            <van-nav-bar title="修改地址"
                         @click-left="isOpenModal=false"
                         fixed
                         :border="true"
                         class="BackNav"
            >
            <div slot="left" class="left">
                <van-icon name="arrow-left"  size="1.5rem" color="gray"/>
                返回
            </div>
            </van-nav-bar>
            <van-address-edit
                    :area-list="areaList"
                    class="overPosition"
                    :is-saving="false"
                    :tel-validator="tel"
                    :addressInfo="addressInfo"
                    @save="save"
            />
        </van-popup>
        <to-top ></to-top>
    </div>
</template>
<script>
import  areaList from '../data/Area'
import backNav from '../components/backNav.vue'
import toTop from '../components/totop.vue'
import {Icon,Popup,AddressEdit, NavBar} from 'vant'
import 'vant/lib/icon/style'
import 'vant/lib/popup/style'
import 'vant/lib/address-edit/style'
import 'vant/lib/nav-bar/style'
import  Vue from 'vue'
import  {mapState} from 'vuex'
import {api} from '../utils/api'
Vue.use(Icon).use(Popup).use(AddressEdit).use(NavBar)
export default{
    components:{
        backNav,
        toTop
    },
    mounted(){
      window.addEventListener('scroll',this.scroll)
    },
    destroyed(){
        window.removeEventListener('scroll',this.scroll)
    },
    data(){
        return{
          isFixedClass:'',
          contentClass:'',
          isOpenModal:false,
           areaList:areaList,
            addressInfo:{
              id:'',
              name:'',
                tel:'',
                addressDetail:'' ,
                isDefault:false,
          },
        }
    },
    methods:{
        scroll(){
            let scrollTop=window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop;
            scrollTop>30?this.isFixedClass='fixedTitle':this.isFixedClass='';
            scrollTop>30?this.contentClass='marginTop':this.contentClass=''
        },
        chooseAddress(id){
            this.$store.dispatch("userMs/changeDefaultChooseAddress",id)
        },
        editAddress(val){
            //初始化数据
            this.addressInfo.id=val.address_id;
            this.addressInfo.name=val.recipient;
            this.addressInfo.tel=val.phone;
            this.addressInfo.addressDetail=val.address;
            this.isOpenModal=true;
        },
        addNewAddress(){ //添加新地址
            this.isOpenModal=true;
            this.addressInfo.id='';
            this.addressInfo.name='';
            this.addressInfo.tel='';
            this.addressInfo.addressDetail='';
        },
        tel(str){
            if(!(/^1[34578]\d{9}$/.test(str))){
                return false
            }else {
                return true
            }

        },
        save(content){
            const data={
                address_id:content.id,
                recipient:content.name,
                phone:content.tel,
                area:content.province+content.city+content.country,
                address:content.addressDetail
            };
            api.post("/user/updateAddress",data).then(()=>{
                    this.$store.dispatch("userMs/getUserAddress");
                });
            this.isOpenModal=false;
        }
    },
    computed:{
        ...mapState("userMs",["userAddMs",'chooseAddId'])
    }
}
</script>
<style lang="scss" scoped>
.overPosition{
    width: 375px;
    height: 617px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-top: 50px;

}
.van-address-edit{
    .van-cell {
        margin-top: 50px;
    }
}
.fontSize{
    height: 100%;
    /*display: flex;*/
    /*flex-direction: column;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
}
.BackNav{
    background-color: white;
    height: 50px;
    .left{
        color: black;
    }
}
.titleTip{
    margin-top: 50px;
    text-align: center;
    position: relative;
    width: 345px;
    height: 20px;
    line-height: 20px;
    transition: height 0.3s linear;
}
.fixedTitle{
    position: fixed;
    top:50px;
    margin-top: 0;
    height: 10px;
    line-height: 10px;
    z-index: 999;
    background-color: white;
}
.titleTip:before{
    content: "";
    position: absolute;
    width: 60px;
    height: 1PX;
    left:  60px;
    bottom: 50%;
    transform: translateY(-50%);
    background-color: #b1b1b1;
}
.titleTip:after{
    content: "";
    position: absolute;
    width: 60px;
    height: 1PX;
    right:  60px;
    bottom: 50%;
    transform: translateY(-50%);
    background-color: #b1b1b1;
}

.addressArea{
     .item{
         position: relative;
         height: 70px;
     }
    .item:after{
        content: '';
        position: absolute;
        bottom:0;
        width: 345px;
        height: 1PX;
        background-color: #e5e5e5;
    }
    .item:last-child:after{
        height: 0;
    }
    .AddArea{
        width: 250px;
    }
    .editBtn{
        width: 45px;
        height: 45px;
        text-align: center;
        line-height: 45px;
        border-radius: 10px;
        border: 1PX solid #b1b1b1;
    }
}
.addNewBtn{
    position: fixed;
    bottom: 0;
    height: 20px;
    width: 345px;
     background-color: #ff6700;
    color: white;
    text-align: center;
}
.rowFlex{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
    .normalFont{
        font-size: 14px;
    }
    .MaxFont{
        font-size: 16px;
    }
    .padding{
        padding: 15px 15px;
    }
    .paddingBottom{
        padding-bottom: 50px;
    }
    .marginTop{
        margin-top: 90px;
   }
    .InfoColor{
        color: #7a7a7a;
    }
    .bgWhite{
        background-color: white;
    }
    .fontBold{
        font-weight: bold;
    }
    .MiniMarginTop{
        margin-top: 5px;
    }
.ChooseClass{
    background-color: #ff6700;
}
.notChoose{
    background-color: white;
}
</style>