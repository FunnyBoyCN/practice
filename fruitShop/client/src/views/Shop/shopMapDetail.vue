<template>
    <div>
        <navbar :navbarTitle="'门店详情'"/>
        <div class="map" id="container"></div>
        <div class="shopDetail border">
           <div class="detail">
               <h4>{{shop.name}}</h4>
               <span>{{shop.address}}</span>
               <span>门店营业时间：{{shop.opening}}</span>
           </div>
            <div class="connect" @click.stop="call">
                <van-icon name="phone-o" size="22px" color="black"/>
                <span>联系门店</span>
            </div>
        </div>
        <button class="confirm" @click.stop="$router.go(-1)">
            <span>确定</span>
        </button>
    </div>
</template>
<script>
    import navbar from '../../components/navbar.vue'
    import myOverlay from '../../utils/myOverlay'
    import Vue from 'vue'
    import {Icon} from 'vant'
    Vue.use(Icon);
    import {api} from '../../utils/api'
   export default{
       components:{
           navbar
       },
       data(){
           return{
              shop:{},
              point:{}
           }
       },
       methods:{
            drawMap(oPoint){
               let map = new BMap.Map("container");
               let point = new BMap.Point(oPoint.lng,oPoint.lat);
               map.centerAndZoom(point,20);
               map.addControl(new BMap.NavigationControl());
               map.addControl(new BMap.GeolocationControl());
               var mySquare =new myOverlay(map.getCenter(), 35, "white");
               map.addOverlay(mySquare);
            },
           cityLocationTrans(address,city){
               let myGeo = new BMap.Geocoder();
               let result={lng:0,lat:0};
               return new Promise((resolve)=>{
                   myGeo.getPoint(address, function(point){
                       if (point) {
                           result.lng=point.lng;
                           result.lat=point.lat;
                           resolve(point)
                       }
                   }, city);
               })
           },//城市转换坐标 百度坐标
           shopDetail(){
               const id=this.$route.query.id;
               api.get('/Shop',{params:{id}}).then(res=>{
                       this.shop=res.result;
                        return this.cityLocationTrans(this.shop.address,this.shop.city);
                   }).then(res=>{
                      this.drawMap(res);
                   })
           },
           call(){
               let a=document.createElement(`a`);
               a.setAttribute('href',`tel:186-8977-2300`);
               document.body.appendChild(a);
               a.click();
               a.remove();
           }
       },
       mounted(){
           this.shopDetail();
       }
   }
</script>
<style lang="scss" scoped>
      .map{
          width: 375px;
          height: 300px;
      }
    .shopDetail{
        width: 355px;
        padding:20px 10px;
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        .detail{
            display: flex;
            flex-direction: column;
            width: 60%;
            h4{
                margin: 0;
            }
            span{
                margin-top: 8px;
                color: $text-color;
                font-size: 14px;
                @include LongtextHidden;
            }
        }
        .connect{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            span{
                margin-top: 8px;
            }
        }
    }
    .confirm{
        position: fixed;
        bottom: 0;
        width: 375px;
        height:50PX;
        padding:10PX 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        @include reloadButton;
        background-color: #19A251;
        span{
            color: white;
        }
    }
</style>