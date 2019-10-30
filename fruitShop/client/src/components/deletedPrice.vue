<template>
    <div>
        <del class="del" :style="{fontSize:fontSize+'px',color:color}">{{text}}</del>
    </div>
</template>
<script>
    export default{
        props:['text','fontSize','color']
    }
</script>
<style lang="scss" scoped>
    .del:before{
        content: '\00A5';
    }
</style>