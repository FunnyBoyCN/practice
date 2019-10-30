<template>
    <div class="title flex row"><span class="css1b97c1a97920470">{{text?text:'纤果汇'}}</span></div>
</template>
<script>
    export default{
        props:['text']
    }
</script>
<style lang="scss" scoped>
    .title{
        width: 375px;
        height: 45PX;
        background-color: $main-color;
        span{
            height: 45px;
            line-height: 45px;
            margin-left: 15px;
            font-weight: bold;
            color: white;
            font-size: 20px;
        }
    }
</style>