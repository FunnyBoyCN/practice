<template>
    <div>
       <navbar :navbarTitle="'搜索'"/>
       <div class="searchInput border">
           <div class="inputArea">
               <van-icon name="search" size="16px" color="#D1D1D1" class="icon"/>
               <input placeholder="搜搜想吃的水果" ref="input" v-model="str" @focus="focus"/>
               <div class="close" >
                   <van-icon name="close" size="16px" color="#7a7a7a"  class="icon" v-show="str!==''"  @click.stop="str=''"/>
               </div>
           </div>
           <button class="searchButton" @click.stop="search">搜索</button>
       </div>
        <router-view/>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import {Icon} from 'vant'
    import {api} from '../../utils/api'
    import Vue from 'vue'
    Vue.use(Icon)
    export default{
        components:{
            navbar
        },
        data(){
            return{
                str:'',
                goods:[]
            }
        },
        mounted(){
            if(this.str.length==0){
                this.$router.replace('/search/pendingSearch');
            }
        },
        methods:{
            search(){
                if(this.str!==''){
                    this.$store.dispatch('searchHistory/ChangeSearch',this.str);
                    api.post('/search',{str:this.str}).then(res=>{
                        this.goods=res.result;
                        this.$router.replace('/search/searchResult');
                    })
                }
            },
            focus(){
                this.$router.replace('/search/pendingSearch');
            }
        },
        watch:{
            str(){

            }
        }
    }
</script>
<style lang="scss" scoped>
     .searchInput{
         width: 355px;
         padding:10px 10px 8px 10px ;
         background-color: white;
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         height: 30px;
         .inputArea{
             display: flex;
             flex-direction: row;
             justify-content: space-between;
             align-items: center;
             width: 300px;
             background-color: #F2F2F2;
             @include radius(15px);
             height: 30px;
             .close{
                 height: 30px;
                 display: flex;
                 flex-direction: column;
                 justify-content: center;
                 overflow: hidden;
             }
             .icon{
                 padding: 0 10px;
             }
             input{
                 border: 0;
                 outline: none;
                 background-color:  #F2F2F2;
                 line-height: 24px;
                 font-size: 14px;
                 width: 255px;
             }
         }
         .searchButton{
             @include reloadButton;
             background-color: white;
             line-height: 30px;
             font-size: 14px;
         }
     }
</style>