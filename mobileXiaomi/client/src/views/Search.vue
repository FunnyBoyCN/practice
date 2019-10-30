<template>
    <div>
        <div class="flex row height justCenter alignCenter fixed">
            <van-icon name="arrow-left" size="1rem" class="grow flex justCenter alignCenter bgwhite height" @click="goBack"></van-icon>
            <van-search
                    v-model="value"
                    placeholder="请输入搜索关键词"
                    show-action
                    shape="round"
                    @search="onSearch"
                    class="growTwo"
                    @focus="foucus" @input="input"
            >
                <div slot="action" @click="onSearch">搜索</div>
            </van-search>
                <ul v-show="isShow" class="showItem " @click="hiddenSearch" >
                    <transition-group   enter-active-class="animated slideInDown faster"
                                        leave-active-class="animated slideOutUp faster"
                    >
                    <li v-show="isShow" v-for="(value,index) in showItem" :key="index" class="borderItem" mode="out-in" @click="toSearch(value)">{{value.name}}</li>
                    </transition-group>
                </ul>
        </div>
        <div class="main">
            <div v-if="isParent">
                <title-text :titleName="'热门搜索'"></title-text>
                <van-image src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/654345a4a51687cd1d935ee5fd52c383.jpg?w=1080&h=300&bg=202E4F"></van-image>
                <div class="searchClassify padding">
                    <div class="item paddingFont marginLeft border" :style="colorStyle()" v-for="(val,index) in searchContent" @click="toList(val.name)">{{val.name}}</div>
                </div>
            </div>
            <router-view v-if="!isParent"></router-view>
        </div>
    </div>
</template>
<script>
    import  {Search,Image,Icon} from 'vant'
    import {myApi} from '../utils/myApi'
    import titleText from '../components/title.vue'
    import 'vant/lib/search/style'
    import 'vant/lib/image/style'
    import 'vant/lib/icon/style'
    import  Vue from 'vue'
    Vue.use(Search).use(Image).use(Icon)
    import backNav from '../components/backNav.vue'
   export default{
       created(){
           this.$store.commit('render/IsHome',false)

       },
       mounted(){

       },
       data(){
           return{
               value:'',
               isParent:true,
               showItem:[],
               pid:'',
               isShow:false,
               searchContent:[{
                   name:'小米8青春版',
                   pid:1
               },
                   {
                       name:'红米Note7',
                       pid:2
                   }]
           }
       },
       watch:{

       },
       methods:{
           toList(name){
               this.value=name;
               this.isParent=false;
               this.$router.push({path:'/Search/list',query:{
                   key:this.value,
               }});
           },
           toSearch(val){
              this.value=val.name;
              this.isShow=false;
           },
           hiddenSearch(){
               this.isShow=false;
           },
           goBack(){
               this.isParent=true;
               this.$router.go(-1);
               this.value='';
           },
           onSearch(){
               this.isParent=false;
               this.isShow=false;
               this.$router.push({path:'/Search/list',query:{
                   key:this.value,
               }});
           },
           foucus(){
               myApi.post(`/Search`,{name:this.value}).then(res=>{
                   this.showItem=res;
                   this.isShow=true;
               })
           },
           input(){
             myApi.post(`/Search`,{name:this.value}).then(res=>{
                 this.showItem=res;
                 this.isShow=true;
             })
           },
           colorStyle(){
               const opacity=Math.random().toFixed(2);
               const R=Math.floor(Math.random()*255);
               const G=Math.floor(Math.random()*255);
               const B=Math.floor(Math.random()*255);
               return {
                   background:`rgba(${R},${G},${B},${opacity})`,
               }

           }
       },
       components:{
           backNav,
           titleText
       }
   }
</script>
<style lang="scss" scoped>
    .fixed{
        position: fixed;
        z-index: 5;
        width: 375px;

    }
.main{
    height: 602px;
    background-color: white;
    padding-top: 54px;
}

.showItem{
    position: absolute;
    top:50px;
    width:375px;
    height: 617px;
    background-color: rgba(0,0,0,0.2);
    overflow: hidden;

}
.borderItem{
    position: relative;
    background-color: white;
    height: 35px;
    line-height: 40px;
    text-align: center;
    padding: 5px 5px;
    z-index: 3;
    font-size: 14px;
}
.borderItem:after{
    position: absolute;
    content:'';
    left: 50%   ;
    bottom: 5px;
    height: 1px;
    width: 80%;
    transform: translateX(-50%);
    background-color: #e5e5e5;
}
    .searchClassify{
        display: flex;
        flex-direction: row;
        font-size: 12px;
    }
    .padding{
        padding: 15px 15px;
    }
    .paddingFont{
        padding: 8px 8px;
    }
    .marginLeft{
        margin-left: 15px;
    }
    .border{
        border-radius: 8px;
        border: 1px #ff6700 dotted;
    }
    .flex{
        display: flex;
    }
    .justCenter{
        justify-content: center;
    }
    .alignCenter{
        align-items: center;
    }
    .row{
        flex-direction: row;
    }
    .grow{
        flex-grow: 1;
    }
    .growTwo{
        flex-grow: 2;
    }
    .height{
        height: 54px;
    }
    .bgwhite{
        background-color: white;
    }
</style>