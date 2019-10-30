<template>
    <div>
        <navbar :navbarTitle="'活动详情'"/>
        <div class="item" v-for="(item,index) in events">
            <img class="image" :src="item.img" ref="img" :width="width" @click.stop="to">
            <div class="goods" v-if="item.goodsId!==''"></div>
        </div>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import {api} from '../../utils/api'
   export default{
       components:{
           navbar
       },
       data(){
         return{
             events:[],
             isGoods:false,
             contentText:'',
             width:0
         }
       },
       methods:{
         init(){
             const id=this.$route.query.id;
             api.get('/events',{params:{
                  id
             }}).then(res=>{
                this.events=res.result.contents;
                this.contentText=res.result.contentText;
             })
         },
          to(){
             this.$router.push(this.contentText);
           }
       },
       created(){
          this.init();
       },
       mounted(){
           this.width=document.documentElement.clientWidth+'px';
       }
   }
</script>
<style lang="scss" scoped>

</style>