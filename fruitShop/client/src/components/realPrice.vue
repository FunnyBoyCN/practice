<template>
    <div class="flex row price" ref="price" :class="isEnd?'alignEnd':''" :style="{color:color}">
        <div class="big" :class="beforeSize?' ':'bigSize'" :style="{fontSize:big+'px'}">{{PriceTranForm(text)[0]}}</div>
        <div class="small" :style="{fontSize:small+'px'}">.{{PriceTranForm(text)[1]}}</div>
    </div>
</template>
<script>
    export default{
        props:['big','small','text','color','isEnd','beforeSize'],
        computed:{
            PriceTranForm(){
                return (val)=>{
                    if(val){

                        return val.toString().split('.');
                    }else {
                        return ['','']
                    }
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
    .alignEnd{
        align-items: flex-end;
    }
    .price{
        .big{
            text-align: end;
        }
    }

     .bigSize::before{
         font-size: 18px;
     }
    .big:before{
        content: '\00A5';
    }
</style>