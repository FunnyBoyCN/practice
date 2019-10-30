<template>
    <div>
        <navbar :navbarTitle="'我的收货地址'"/>
        <div class="addressContent" >
            <van-swipe-cell v-if="addressList.length!==0" v-for="(item,index) in addressList" :key="index">
                <template slot="left">
                    <div class="itemDeleted" @click="deleted(item._id)">
                        <van-icon name="delete" size="5.5vw"/>
                        <span>删除</span>
                    </div>
                </template>
                <template slot="default">
                    <div class="item flex row border alignCenter "  :class="item.isChoose?'isChoose':''" @click.stop="choose(item)"  >
                        <div class="left">
                            <div class="area">{{item.province+'-'+item.city+'-'+item.county +  '  ' +item.address  }}</div>
                            <div class="recipientMS flex row marginFontTop">
                                <span>{{item.recipient}}</span>
                                <span>{{item.phone}}</span>
                            </div>
                        </div>
                        <div class="right flex row justCenter" @click.stop="edit(item._id)">
                            <van-icon name="edit" size="5.5vw"/>
                        </div>
                        <div class="isDefault" v-show="item.isDefault">
                            <van-icon name="success" class="isDefaultIcon" size="12px" color="white"/>
                        </div>
                    </div>
                </template>
            </van-swipe-cell>
            <no-data v-if="addressList.length==0" :isAddress="true"/>
        </div>
        <div class="addButton">
            <div class="addNew buttonBorder" @click="addNew">
                <van-icon  name="add-o" size="20px" color="#19a251"/>
                <button>新增收货地址</button>
            </div>
            <div class="addDefault" >
                <button @click="setDefault" :class="disabled?'disabled':''" :disabled="disabled">设为默认</button>
            </div>
        </div>
    </div>
</template>
<script>
    import {Icon,SwipeCell,Dialog} from 'vant'
    import {api} from '../../utils/api'
    import Vue from 'vue'
    Vue.use(Icon).use(SwipeCell)
    import navbar from '../../components/navbar.vue'
    import noData from '../../components/order/noData.vue'
    export default{
        components:{
            navbar,
            noData
        },
        data(){
            return{
               addressList:[],
               chooseItem:{},
            }
        },
      async created(){
         const result= await api.get(`/address`);
         this.addressList=result.result;
        },
        methods:{
            addNew(){
                this.$router.push('/address/editAddress')
            },  //添加新地址
            choose(item){
                if(item.isChoose){
                    this.$set(item,'isChoose',false);
                    this.chooseItem={};
                }else {
                    this.addressList.forEach(v=>{
                      this.$set(v,'isChoose',false);
                    });
                    this.$set(item,'isChoose',true);
                    this.chooseItem=item;
                }
            }, //选择设置默认地址
            async setDefault(){
              const isOrder=this.$route.query.isOrder;
              const id=this.chooseItem._id;
              this.addressList.forEach(v=>{
                  v.isDefault=false;
                  if(v._id==id){
                      v.isDefault=true;
                  }
              });
              const result=await api.post('/isDefault',{id:id});
              this.$toast(result.message);
              if(isOrder){
                  this.$router.go(-1);
              }
            }, //设置默认地址
            edit(id){
                this.$router.push({path:'/address/editAddress',query:{id:id}})
            },
            async deleted(id){
                let index;
                this.addressList.forEach((v,k)=>{
                    if(v._id==id){
                        index=k;
                    }
                });
               Dialog.confirm({
                    title: '是否删除该地址',
                }).then(async () => {
                   this.addressList.splice(index,1)
                   const data=await api.post('/deletedAddress',{id:id});
                   this.$toast(data.message);
                }).catch(() => {
                   return false;
               });

            }
        },
        computed:{
            disabled(){
                let result;
                if(JSON.stringify(this.chooseItem)=="{}"){
                    result=true;
                }else {
                    result=this.chooseItem.isDefault;
                }
                return result;
            }
        }
    }
</script>
<style lang="scss" scoped>
    @mixin center{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .border:after{
        position: absolute;
        width: 375px;
    }
    .addressContent{
          width: 100%;
        .itemDeleted{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: red;
            color: white;
            text-align: center;
            padding:0 15px;
        }
          .item{
              padding:15px 10px;
              position: relative;
              .left{
                  width: 90%;
                  .recipientMS{
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      font-size: 14px;
                      color: $text-color;
                      span:nth-child(2){
                          margin-left: 5px;
                      }
                  }
              }
              .right{
                  width: 10%;
              }
              .isDefault{
                 position: absolute;
                  width: 0;
                  height: 0;
                 left: -15px;
                 top: -15px;
                 border-style:solid;
                 border-color: #ed9400 transparent transparent transparent;
                 border-width: 15px;
                 transform: rotate(135deg);
                  .isDefaultIcon{
                      position: absolute;
                      top: -16px;
                      left: -6px;
                      transform: rotate(-135deg);
                  }
              }
          }
      }
    .isChoose{
        background-color: rgba(25, 148, 74, 0.17);
    }

    .addButton{
        position: fixed;
        bottom: 0;
        width: 375px;
        height: 50px;
        @include center;
        .addNew{
            width: 70%;
            height: 100%;
            @include center;
            button{
                height: 20px;
                @include reloadButton;
                background-color: transparent;
                color: $main-color;
                margin-left: 5px;
                display: inline-block;
            }
        }
        .buttonBorder{
            position: relative;
        }
        .buttonBorder:before{
            position: absolute;
            top:0;
            width: 100%;
            height: 1px;
            background-color: $line-color;
            content: '';
        }
        .addDefault{
            height: 100%;
            width: 30%;
            padding: 0;
            button{
                height: 100%;
                width: 100%;
                @include reloadButton;
                background-color: #ed9400;
                color: white;
            }
            .disabled{
                background-color: $bg-color;
                color: $text-color;
            }
        }

    }
</style>