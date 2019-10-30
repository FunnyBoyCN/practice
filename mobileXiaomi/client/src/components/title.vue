<template>
    <div class="title"><span class="titleName">{{titleName}}</span></div>
</template>
<script>
  export default{
     props:['titleName']
  }
</script>
<style lang="scss" scoped>
    .title {
        height: 35px;
        width: 375px;
        background-color: white;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .titleName {
            position: relative;
            font-size: 15px;
            display: block;
            line-height: 35px;
        }
        .titleName::before {
            content: "";
            position: absolute;
            width: 80px;
            height: 1px;
            left: -85px;
            bottom: 50%;
            background-color: #e5e5e5;
        }
        .titleName::after {
            content: "";
            position: absolute;
            width: 80px;
            height: 1px;
            right: -85px;
            bottom: 50%;
            background-color: #e5e5e5;
        }
    }
</style>