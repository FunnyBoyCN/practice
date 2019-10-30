<template>
    <div>
        <div class="title">热门搜索</div>
        <div class="popArea area">
            <template  v-for="item in POPSearch">
                <div class="item" ref="item" @click.stop="searchInput(item)">{{item}}</div>
            </template>
        </div>
        <div class="history" v-if="showHistory">
            <div class="title">
                <span>历史记录</span>
                <button class="clear" @click.stop="clear">
                    <van-icon name="delete" size="18px" color="#7a7a7a" class="item"/>
                    <span class="item">清空</span>
                </button>
            </div>
            <div class="popArea area">
                <template  v-for="item in search">
                    <div class="item" ref="item" @click.stop="searchInput(item)">{{item}}</div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default{
        mounted(){
           if(this.search.length==0){
               this.showHistory=false;
           }else {
               this.showHistory=true;
           }
        },
        data(){
            return{
              POPSearch:['车厘子','柑','冬枣','蜜柚','榴莲','瓜','奇异果','蓝莓','椰子','西梅'],
              showHistory:false
            }

        },
        methods:{
            searchInput(str){
                this.$parent.str=str;
                this.$store.dispatch('searchHistory/ChangeSearch',str);
            },
            clear(){
                this.$store.dispatch('searchHistory/Clear');
            }
        },
        computed:{
            ...mapState('searchHistory',['search'])
        },
        watch:{
            search(){
               if(this.search.length!==0) {
                   this.showHistory=true;
               }else {
                   this.showHistory=false
               }
            }
        }
    }
</script>
<style lang="scss" scoped>
     .title{
         padding:20px 10px 10px 10px ;
         font-size: 14px;
     }
     .area{
         display: flex;
         flex-wrap: wrap;
         align-content: space-around;
         align-items: flex-end;
         padding:0 10px ;
         width: 355px;
        .item{
            padding:8px 15px;
            min-width:26px ;
            background-color: #f2f2f2;
            margin-right: 10px;
            @include radius(8px);
            text-align: center;
            margin-top: 10px;
            font-size: 14px;
        }
     }
     .history{
         .title{
             position: relative;
             font-size: 14px;
             display: flex;
             flex-direction: row;
             justify-content: space-between;
             align-items: center;
             .clear{
                 display: flex;
                 flex-direction: row;
                 justify-content: center;
                 align-items: center;
                 @include reloadButton;
                 font-size: 16px;
                 .item{
                     height: 100%;
                     display: flex;
                     flex-direction: column;
                     justify-content: center;
                 }
                 span{
                     margin-left: 5px;
                     color: #7a7a7a;
                 }
             }
         }

     }
</style>