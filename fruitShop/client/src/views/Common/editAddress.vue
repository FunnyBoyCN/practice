<template>
    <div>
        <navbar navbarTitle="编辑地址"/>
        <van-address-edit
                :area-list="areaList"
                show-delete
                :delete-button-text="'重置'"
                :detail-rows="2"
                show-set-default
                @save="onSave"
                @delete="onReload"
                :tel-validator="phoneCheck"
                :address-info="AddressInfo"
        />
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import areaList from '../../assets/Area'
    import {api} from '../../utils/api'
    import Vue from 'vue';
    import {AddressEdit,Area,Dialog} from 'vant';
    Vue.use(AddressEdit).use(Area);
    export default{
        components:{
            navbar
        },
        data(){
            return{
                areaList,
                userInfo:{},
                AddressInfo:{},
            }
        },
       async mounted(){
         const id=this.$route.query.id;
         if(id){
             const data=await api.get(`/addressById?id=${id}`);
             let areaCode;
             for(let i in areaList.county_list){
                 if(areaList.county_list[i]==data.result.county){
                     areaCode=i;
                 }
             }
             this.AddressInfo={
                 id:id,
                 name:data.result.recipient,
                 tel:data.result.phone,
                 province:data.result.province,
                 city:data.result.city,
                 county:data.result.county,
                 addressDetail:data.result.address,
                 isDefault:data.result.isDefault,
                 areaCode:areaCode,
             }
         }
         this.userInfo= await api.get('/userInfo');
        },
        methods:{
           async onSave(content){
               const id=this.$route.query.id;
                const data={
                    userId:this.userInfo.result.userId,
                    id:id,
                    recipient:content.name,
                    province:content.province,
                    city:content.city,
                    county:content.county,
                    address:content.addressDetail,
                    phone:content.tel,
                    isDefault:content.isDefault,
                };
                const result=await api.post('/editAddress',data);
                this.Notify({type:'success', message:result.message});
                this.$router.go(-1);
            },
            phoneCheck(string){
              const reg=new RegExp(/^1[3|7|5|8|6|9][0-9]{9}$/);
              return reg.test(string);
            },
            onReload(content){
              for(let i in content){
                  if(i!=='isDefault'){
                      content[i]='';
                  }else {
                      content[i]=false;
                  }
              }
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>