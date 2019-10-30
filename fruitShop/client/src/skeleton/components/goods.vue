<template>
    <div class="flex row  container">
        <div class="goodsImg"></div>
        <div class="goodsShow flex row spaceBetween alignCenter">
            <div class="goodsMs flex column spaceBetween">
                <div class="title" v-for="i in 3"></div>
            </div>
            <div class="button"></div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .container{
        width: 100%;
        height: 120px;
        padding:10px 0;
        .goodsImg{
            align-self: center;
            height: 80px;
            width: 80px;
            @include bgColor;
        }
        .goodsShow{
            position: relative;
            .button{
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 20px;
                height: 20px;
                @include radius(50%);
                @include bgColor;
            }
            padding-left: 10px;
            flex-grow: 1;
            .goodsMs{
                height: 80%;
                flex-grow: 1;
                .title{
                    height: 15px;
                    width: 95%;
                    @include bgColor;

                }
                .title:last-child{
                    width: 45%;
                }
            }
        }
    }

</style>