<template>
    <div class="classify">
        <div class="leftNav">
        <van-sidebar :active-key="activeKey" @change="onChange">
            <van-sidebar-item :title="v.title"  v-for="(v,k) in mainData" :url="'#box'+k"/>
        </van-sidebar>
        </div>
        <div class="rightClassify" @scroll="rightScroll" id="rightClassify">
            <div class="contentItem" v-for="(v,k) in mainData" :key="k" :id="'box'+k">
                <div class="title"><p class="titleName">{{v.title}}</p></div>
                <div class="box">
                    <template v-if="v.imgs">
                        <div class="boxItem" v-for="(val,index) in v.imgs" :key="index" >
                            <div class="imgbox">
                                <img class="boxImg" :src="val.url">
                            </div>
                            <p class="description">{{val.name}}</p>
                        </div>
                    </template>
                </div>
            </div>
            <to-top :target="scrollDom"></to-top>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import {myApi} from '../utils/myApi'
import { Sidebar, SidebarItem } from 'vant';
import 'vant/lib/sidebar/style';
import 'vant/lib/sidebar-item/style';
import toTop from '../components/totop.vue'
Vue.use(Sidebar);
Vue.use(SidebarItem);
export default{
    created(){
        this.$store.commit('render/IsHome',true);
        myApi.get('getClassify').then(res=>{
            this.mainData=res;
        })
    },
    mounted(){

    },
      data(){
          return{
              activeKey:0,
              scrollDom:'rightClassify',
              mainData:[]
          }
      },
    computed:{

    },
    components:{
        toTop,
    },
    methods:{
        toDetail(id){
            this.$router.push({path:'/shopDetail',query:{pid:id}})
        },
        onChange(key){
            this.activeKey=key;
        },
        rightScroll(res){

        }
    }
}
</script>
<style lang="scss" scoped>
    .leftNav{
        width: 85px;
    }
    .rightClassify {
        position: fixed;
        left:85px;
        top:0;
        bottom: 0;
        overflow-y:scroll;
        overflow-x:hidden;
        scroll-behavior:smooth;
        background-color: white;
        .contentItem {
            display: flex;
            margin-top: 30px;
            flex-direction: column;
            .title {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                .titleName {
                    position: relative;
                    font-size: 15px;
                }
                .titleName::before {
                    content: "";
                    position: absolute;
                    width: 20px;
                    height: 1px;
                    left: -35px;
                    bottom: 50%;
                    background-color: #e6e6e6;
                }
                .titleName::after {
                    content: "";
                    position: absolute;
                    width: 20px;
                    height: 1px;
                    right: -35px;
                    bottom: 50%;
                    background-color: #e6e6e6;
                }
            }
            .box {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                flex-wrap: wrap;
                margin-left: 5px;
                .boxItem {
                    margin-top: 15px;
                    width: 33%;
                    .imgbox {
                        padding: 0 20px;
                        .boxImg {
                            width: 55px;
                            height: 60px;
                        }
                    }
                }
            }
            .description {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 12px;
                text-align: center;
            }
        }

    }


</style>