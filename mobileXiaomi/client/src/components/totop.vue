<template>
    <div>
        <transition enter-active-class="zoomIn" leave-active-class="zoomOut"  appear >
        <template v-if="ScrollShow">
        <van-icon name="upgrade" class="totop animated faster" size="2rem" color="white" @click="backtoTop" />
        </template>
        </transition>
    </div>
</template>
<script>
    export default{
        mounted(){
                window.addEventListener('scroll',this.scroll);
                this.target!==undefined?document.getElementById(this.target).addEventListener('scroll',this.scroll):'';
        },
        destroyed(){
                window.removeEventListener('scroll',this.scroll);
        },
        data(){
            return{
                ScrollShow:false,
            }
        },
        props:['target'],
        methods:{
            scroll(){
                if(this.target===undefined){
                    const scrollTop=window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
                    const activeNum=scrollTop/document.body.scrollHeight;
                    if(activeNum>0.4&&this.ScrollShow===false){
                        this.ScrollShow=true;
                    }else if(activeNum<0.4&&this.ScrollShow===true){
                        this.ScrollShow=false;
                    }
                }else {
                    const scrollTop=document.getElementById(this.target).scrollTop;
                    const activeNum=scrollTop/document.getElementById(this.target).scrollHeight;
                    if(activeNum>0.4&&this.ScrollShow===false){
                        this.ScrollShow=true;
                    }else if(activeNum<0.4&&this.ScrollShow===true){
                        this.ScrollShow=false;
                    }
                }

            },
            backtoTop(){
                if(this.target===undefined){
                    document.body.scrollTop=0;
                    document.documentElement.scrollTop=0;
                }else {
                    document.getElementById(this.target).scrollTop=0
                }

            }
        }
    }
</script>
<style scoped>
.totop{
    position: fixed;
    right: 15px;
    bottom: 70px;
    background-color: gainsboro;
    border-radius: 50%;
}
</style>