<template>
    <div>
        <navbar :navbarTitle="'附近门店'"/>
        <div class="position border">
            <span>{{myPosition.text}}</span>
            <button class="go" @click.stop="reloadMyPosition">
                <van-icon name="aim" size="18px" class="icon"/>
                <span>重新定位</span>
            </button>
        </div>
        <div class="item border" v-for="(item,index) in shopList" :key="index" v-model="shopList" @click.stop="chooseShop(item)">
            <div class="isDefault" v-show="item.isChoose">
                <van-icon name="success" class="isDefaultIcon" size="12px" color="white"/>
            </div>
            <div class="shop">
                <h4 class="name">{{item.name}}</h4>
                <span class="address">{{item.address}}</span>
                <span class="time">门店营业时间：{{item.opening}}</span>
            </div>
            <div class="shopDetail">
                <a class="distance">
                    <van-icon name="location-o" size="14px" color="#9D9D9D"/>
                    <span>{{item.distance}}Km</span>
                </a>
                <router-link class="locationDetail" type="a" :to="{path:'/shopMapDetail',query:{id:item._id}}">
                    <van-icon name="shop-o" size="14px" color="#9D9D9D"/>
                    <span>门店详情</span>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Icon,Toast} from 'vant'
    Vue.use(Icon).use(Toast);
    import {mapState} from 'vuex'
    import {api} from '../../utils/api'
    import navbar from '../../components/navbar.vue'
   export default{
       components:{
           navbar
       },
       data(){
           return{
               isChoose:true,
               shopList:[],
               toast:'',
               myPosition:{
                  text:'',
                  lat:0,
                  lng:0
              },
           }
       },
       methods:{
           init(){
               api.get('/Shop').then(res=>{
                   this.shopList=res.result;
                   this.shopList.forEach(async v=>{
                       let res=this.cityLocationTrans(v.address,v.city);
                       this.$set(v,'position',res)
                   });
                   return this.myLocation();
               }).then(res=>{
                   this.reloadPosition(res);
                   this.isChooseShop(this.shopList);
               })
           },
           myLocation(){
               this.toast=Toast.loading({
                   mask: false,
                   message: '定位中...',
                   duration:0
               });
               const that=this;
               let geolocation = new BMap.Geolocation();
               return new Promise((resolve)=>{
                   geolocation.getCurrentPosition(function(res){
                       let position={
                           lat:0,
                           lng:0
                       };
                       if(this.getStatus() == BMAP_STATUS_SUCCESS){
                           that.$set(that.myPosition,'text',res.address.province+res.address.city+res.address.street+res.address.district);
                           that.$set(that.myPosition,'lat',res.point.lat);
                           that.$set(that.myPosition,'lng',res.point.lng);
                           position.lat=res.point.lat;
                           position.lng=res.point.lng;
                           that.savePosition(that.myPosition);
                           that.toast=Toast.success('定位成功');
                           resolve(position);
                       } else {
                           function myFun(result){
                               let cityName = result.name;
                               that.$set(that.myPosition,'text',cityName);
                               that.$set(that.myPosition,'lat',result.center.lat);
                               that.$set(that.myPosition,'lng',result.center.lng);
                               position.lat=result.center.lat;
                               position.lng=result.center.lng;
                               that.savePosition(that.myPosition);
                               that.toast=Toast.fail('无法获取您当前的精确位置');
                               resolve(position);
                           }
                           let myCity = new BMap.LocalCity();
                           myCity.get(myFun);
                       }
                   },{enableHighAccuracy:true});
               })
           }, //获取当前位置
           cityLocationTrans(address,city){
               let myGeo = new BMap.Geocoder();
               let result={};
               myGeo.getPoint(address, function(point){
                       if (point) {
                           result.lng=point.lng;
                           result.lat=point.lat;
                       }
                   }, city);
                 return result;
           },//城市转换坐标 百度坐标
           calcDistance(point1,point2){
               try {
                   const end=new BMap.Point(point2.lng,point2.lat);
                   const start=new BMap.Point(point1.lng,point1.lat);
                   let map= new BMap.Map();
                   return (map.getDistance(start,end)/1000).toFixed(2);

               }catch (err){
                   console.log(err)
               }
           } , //距离当前位置距离 单位KM
           reloadPosition(position){  //重新获取当前位置计算距离
               const myPosition={
                   lat:position.lat,
                   lng:position.lng
               };
               this.shopList.forEach(v=>{
                   const distance=this.calcDistance(myPosition,v.position);
                   this.$set(v,'distance',Number(distance));
               });
               this.shopList.sort(function (a,b) {
                   return a.distance-b.distance;
               });
           },
           isChooseShop(shopList){
               const value=shopList.findIndex((item)=> {
                   return item._id==this.nearbyShop.id;
               });
               if(value==-1){
                   return false
               }else {
                   shopList[value].isChoose=true;
                   this.shopList=shopList;
               }
           }, //判断已选中的商店
           chooseShop(val){
               const collageCheckout=this.$route.query.collageCheckout;
               this.shopList.forEach(v=>{
                   this.$set(v,'isChoose',false);
               });
               this.$set(val,'isChoose',true);
               this.$store.dispatch('nearbyShop/ChangeNearbyShop',{id:val._id,name:val.name,opening:val.opening,address:val.address});
               collageCheckout?this.$router.go(-1):'';
           },//选择商店
           reloadMyPosition(){
               this.myLocation().then(res=>{
                  this.reloadPosition(res);
               });
           },
           savePosition(data){
               this.$store.dispatch('myPosition/ChangePosition',data)
           }
       },
       created(){
           this.init();
       },
       computed:{
           ...mapState('nearbyShop',['nearbyShop']),
           ...mapState('myPosition',['position'])
       }
   }
</script>
<style lang="scss" scoped>
     .position{
         padding:10px 10px;
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         align-items: center;
         .go{
             display: flex;
             flex-direction: row;
             align-items: center;
             @include reloadButton;
             color: #1989fa;
             .icon{
                 margin-right: 5px;
             }
         }
     }
     .item{
         padding:20px 10px;
         width: 355px;
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         align-items: center;
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
         .shop{
             display: flex;
             flex-direction: column;
             width: 60%;
             h4{
                 margin: 0;
             }
             span{
                 margin-top: 8px;
                 font-size: 12px;
                 color: $text-color;
                 @include LongtextHidden;
             }
         }
         .shopDetail{
             font-size: 14px;
             display: flex;
             flex-direction: column;
             align-items: flex-start;
             a{
                 display: flex;
                 flex-direction: row;
                 align-items: center;
                 span{
                     margin-left: 5px;
                     font-size: 12px;
                 }
             }
             a:last-child{
                 margin-top: 15px;
             }

         }
     }
</style>