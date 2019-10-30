<template>
    <div class="editPayPassword">
        <navbar :navbarTitle="'支付密码'"/>
        <old-pay-password v-show="isOld"/>
        <new-pay-passwrod v-show="!isOld"/>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import oldPayPassword from './oldPayPassword.vue'
    import newPayPasswrod from './newPayPasswrod.vue'
    import {mapState} from 'vuex'
    import Vue from 'vue';
    export default{
        components:{
            navbar,
            oldPayPassword,
            newPayPasswrod,
        },
        data(){
            return{

            }
        },
        destroyed(){
            this.$store.dispatch('payPassword/Reload');
        },
        mounted(){
          const edit=this.$route.query.edit;
          if(!edit){
              this.$store.dispatch('payPassword/ChangeIsOld',false);
          }
        },
        computed:{
            ...mapState('payPassword',['isOld'])

        },
        methods: {

        }
    }
</script>
<style lang="scss" scoped>
    .editPayPassword{
        background-color: $bg-color;
        height: 100vh;

    }
</style>