<template>
    <div class="bgtext">
        <div>您还没有 {{content}} 的订单</div>
    </div>
</template>
<script>
     export default{
         props:['content'],
         data(){
             return{

             }
         }
     }
</script>
<style>
    .bgtext{
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 20px;
        align-items: center;
        width: auto;
        height:200px;
        background: url("https://s1.mi.com/m/images/m/empty.png") center no-repeat;
        background-size: 100px 100px;
    }
</style>