<template>
    <div class="tabbar flex row spaceBetween alignCenter">
        <div class="itemWrap flex row alignCenter justCenter" v-for="item in 4">
            <div class="item"></div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .tabbar{
        width: 100%;
        height: 50px;
        position: fixed;
        bottom: 0;
        z-index: 2;
        background-color: white;
        .itemWrap{
            flex-grow: 1;
            height: 100%;
            background-color: white;
            .item{
                width: 50px;
                height: 35px;
                @include bgColor;
            }
        }
    }
</style>