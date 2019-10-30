<template>
    <div class="bg paddingLR">
        <div class="top">
            <title-view/>
            <div class="topControl flex row alignCenter">
                <div class="left"></div>
                <icon-view/>
                <icon-view/>
            </div>
        </div>
        <div class="leftNav flex column">
            <template v-for="item in 15">
                <div class="item marginTop"></div>
            </template>
        </div>
        <div class="rightContent">
             <div class="swipeImage"></div>
             <goods v-for="item in 2"/>
        </div>
        <tabbar class="tabbar"/>
    </div>
</template>
<script>
    import titleView from '../components/title.vue'
    import iconView from '../components/icon.vue'
    import goods from '../components/goods.vue'
    import tabbar from '../components/tabbar.vue'
    export default{
        components:{
            titleView,
            iconView,
            goods,
            tabbar
        }
    }
</script>
<style lang="scss" scoped>
    .bg{
        background-color: white;
        height: 98vh;
        width: 355px;
        .top{
            height: 100px;
            .topControl{
                margin: 10px 0;
                height: 30px;
                width: 100%;
                overflow: hidden;
                .left{
                    @include bgColor;
                    width: 70%;
                    height: 100%;
                }
            }
        }
        .leftNav{
            position: fixed;
            left: 10px;
            top:100px;
            width: 85px;
            .item{
                width: 100%;
                height: 50px;
                @include bgColor;
            }
        }
        .rightContent{
            position: fixed;
            top:100px;
            left: 105px;
            padding:10px 0;
            width: 260px;
            .swipeImage{
                width:100%;
                height: 120px;
                @include radius(15px);
                @include bgColor;
            }
        }
        .tabbar{
            width: 355px;
        }
    }
</style>