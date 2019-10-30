<template>
    <div class="pickUpTimes padding flex column alignCenter">
        <span>提货时间</span>
        <span>{{timelimit}}</span>
    </div>
</template>
<script>
    import timeTransForm from '../../utils/timeTransForm'
    export default{
        props:['time'],
        computed:{

        },
        data(){
            return{
                timelimit:[]
            }
        },
       watch:{
           time(val,oldval){
               if(val!==oldval){
                   this.timelimit=timeTransForm(this.time);
               }
           }
       }
    }
</script>
<style lang="scss" scoped>
    .pickUpTimes{
        height: 50px;
        background-color: white;
        margin: 10px 0;
        span{
            font-size: 14px;
            margin-top: 5px;
        }
        span:last-child{
            margin-top: 5px;
            font-size: 16px;
        }
    }
</style>