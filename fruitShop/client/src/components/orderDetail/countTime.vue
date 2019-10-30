<template>
    <div class="countTimeView">
       <span>{{countTime}}</span>
    </div>
</template>
<script>
    import countTime from '../../utils/countTime'
    export default{
        data(){
            return{
                countTime:`00:00:00`,
                timer:'',
                myStopTime:0,
            }
        },
        props:{
          stopTime:{
              type:Number,
              default:0
          },
           isDetail:{
               type:Boolean,
               default:false
            }
        },
        methods:{
           openCountTime(time){
               this.countTime=countTime.dateTransform(time);
               if(time!==0){
                   this.timer=setInterval(()=>{
                       time=time-1000;
                       this.countTime=this.isDetail?countTime.dateTransform(time):`00:${countTime.dateTransform(time)}`
                       if(time==0){
                           this.$emit('stop',true);
                           clearInterval(this.timer)
                       }
                   },1000)
               }else {
                   this.countTime=''
               }
           }
        },
        mounted(){
            this.openCountTime(this.stopTime);
        },
        watch:{
            stopTime(val,oldval){
                if(val!==oldval){
                    this.openCountTime(this.stopTime);
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .countTimeView{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
</style>