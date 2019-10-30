<template>
  <div class="home" :style="{height:homeHeight+'px'}">
     <div class="top" ref="top">
         <fruit-title/>
         <header class="header flex row paddingTB border">
             <div class="slogan">59分钟送达</div>
             <router-link to="/nearbyShop" type="div" class="lineAddress flex row marginLR" >
                 <span>附近门店:</span>
                 <div class="addressText">{{nearbyShop.name}}</div>
                 <van-icon name="play"></van-icon>
             </router-link>
             <div class="rightControl flex row justCenter alignCenter">
                 <div class="search flex column justCenter alignCenter" @click.stop="toUrl('/search')">
                     <van-icon name="search" size="1.3rem"></van-icon>
                     <span>搜索</span>
                 </div>
                 <div class="memberCode flex column justCenter alignCenter" @click.stop="toUrl('/memberCode')">
                     <van-icon name="card"  size="1.3rem"></van-icon>
                     <span>会员码</span>
                 </div>
             </div>
         </header>
     </div>
      <main class="main" >
          <div class="leftNav" ref="leftNav" :style="'height:'+height+'px'">
              <div class="content">
                  <van-sidebar :active-key="activeKey" @change="onChange" >
                      <van-sidebar-item title="全部水果" @click="activeKey=0" />
                      <van-sidebar-item  v-for="(item,index) in mainGoods" :title="item.name" :key="index"  />
                  </van-sidebar>
                  <div  style="height: 15.733vw;background-color: #F8F8F8" />
              </div>
          </div>
          <div class="rightContent paddingTop" :style="'height:'+height+'px'" >
                  <van-swipe :autoplay="3000" indicator-color="gray" class="swipe" >
                      <van-swipe-item  v-for="(item,index) in activity" :key="index"  @click.prevent="activityDetail(item._id)">
                          <van-image
                                  height="26.66vw"
                                  width="72vw"
                                  fit="cover"
                                  :src="item.headerImg"
                                  :data-url="item.headerImg"
                          >
                              <template v-slot:loading>
                                  <van-loading type="spinner" size="20" />
                              </template>
                              <template v-slot:error>加载失败</template>
                          </van-image>
                      </van-swipe-item>
                  </van-swipe>
                  <div class="goodsContent">
                      <good-item :goodsItem="goods"></good-item>
                      <div class="goodsCover"></div>
                  </div>
          </div>
      </main>
  </div>
</template>
<script>
    import goodItem from '../../components/goodsItem.vue'
    import fruitTitle from '../../components/title.vue'
    import {mapState} from 'vuex'
    //    <!--views-->
    import BScroll from '@better-scroll/core'
    import {api} from '../../utils/api'
    import axios from 'axios'
    import {Sidebar, SidebarItem,Search,Icon,Image,Loading,Toast,Button,Swipe,SwipeItem} from 'vant'
    import Vue from 'vue'
    Vue.use(Sidebar).use(SidebarItem).use(Search).use(Icon).use(Image).use(Loading).use(Toast).use(Button).use(Swipe).use(SwipeItem);
    export default {
    data() {
        return {
            activeKey: 0,
            mainGoods:[],
            height:0,
            goods:[],
            goodsNum:0,
            homeHeight:0,
            toast:'',
            activity:[]
        };
    },
    methods:{
        onChange(key){
            this.goods=[];
            this.activeKey=key;
            if(this.activeKey==0){
                this.mainGoods.forEach(v=>{
                    if(v.goodsItem.length!==0){
                        v.goodsItem.forEach(k=>{
                            this.goods.push(k)
                        })
                    }
                });
            }else {
                this.mainGoods[this.activeKey-1].goodsItem.forEach(v=>{
                    this.goods.push(v)
                });
            }

        },
        async init(){
            return  api.get('/mainGoods');
        },
        activityDetail(id){
            this.$router.push({
                path:'/activityDetail',
                query:{
                    id
                }
            })
        },
        toUrl(url){
            this.$router.push(url);
        },
        activityInit(){
            return api.get('/events');
        },
        shopInit(){
            api.get('/Shop').then(res=>{
                const shopList=res.result;
                shopList.forEach(v=>{
                    v.position=this.cityLocationTrans(v.address,v.city);
                });
                return this.myLocation(shopList);  //获取当前位置
            }).then(res=>{

               return this.reloadPosition(res);
            }).then(res=>{
                const data={
                    name:res.name,
                    id:res._id,
                    address:res.address,
                    opening:res.opening,
                };
                this.$store.dispatch('nearbyShop/ChangeNearbyShop',data)
            })
        },//获取最近商店
        myLocation(shopList){
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
                        position.text=res.address.province+res.address.city+res.address.street+res.address.district;
                        position.lat=res.point.lat;
                        position.lng=res.point.lng;
                        that.toast=Toast.success('定位成功');
                        that.savePosition(position);
                        resolve({shopList,position});
                    } else {
                        function myFun(result){
                            position.text=result.name;
                            position.lat=result.center.lat;
                            position.lng=result.center.lng;
                            that.toast=Toast.fail('无法获取您当前的精确位置');
                            that.savePosition(position);
                            resolve({shopList,position});
                        }
                        let myCity = new BMap.LocalCity();
                        myCity.get(myFun);
                    }
                },{enableHighAccuracy:true});
            })
        }, //获取当前位置
        cityLocationTrans(address,city){
            let myGeo = new BMap.Geocoder();
                let result={lng:0,lat:0};
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
        reloadPosition(res){  //重新获取当前位置计算距离
            return new Promise((resolve)=>{
                const myPosition={
                    lng:res.position.lng,
                    lat:res.position.lat
                };
                const shopList=res.shopList;
                for(let i=0;i<shopList.length;i++){
                    const distance=this.calcDistance(myPosition,shopList[i].position);
                    shopList[i].distance=Number(distance);
                }
                shopList.sort(function (a,b) {
                    return a.distance-b.distance;
                });
                resolve(shopList[0])
            })
        },
        savePosition(data){
            this.$store.dispatch('myPosition/ChangePosition',data)
        }
    },
    components:{
        goodItem,
        fruitTitle,
    },
    computed:{
        ...mapState('nearbyShop',['nearbyShop']),
        ...mapState('myPosition',['position'])
    },
    async mounted(){
            if(this.nearbyShop.id==''){
                this.shopInit();
            }
            let promise1=this.activityInit();
            let promise2=this.init();
            axios.all([promise1,promise2]).then(axios.spread((result1,result2)=>{
                this.mainGoods=result2;
                this.mainGoods.forEach(v=>{
                    if(v.goodsItem.length!==0){
                        v.goodsItem.forEach(k=>{
                            this.goods.push(k)
                        })
                    }
                });
                this.activity=result1.result;
            })).catch(err=>{
                Toast.fail('加载失败')
            }).finally(()=>{
                try{
                    const top=this.$refs.top;
                    this.homeHeight=document.documentElement.clientHeight;
                    this.height=(document.documentElement.clientHeight-top.clientHeight-50);
                    this.$nextTick(() => {
                        if(!this.bs){
                            this.bs = [new BScroll(this.$refs.leftNav, {
                                scrollY: true,
                                click: true,
                                tap:true,
                                probeType: 3,
                            })];
                        }else {
                            this.bs.refresh();
                        }
                    })
                }catch (err){
                    console.log(err)
                }
            })
    }
}
</script>
<style lang="scss" scoped>
    .header{
        height: 35px;
        .slogan{
            text-align: center;
            line-height: 35px;
            font-weight: bold;
            color:$main-color;
            flex-grow: 1;
        }
        .lineAddress{
            @include radius(10px);
            background-color: $bg-color;
            flex-grow: 2;
            line-height: 35px;
            height: 35px;
            color:$text-color;
            justify-content: space-around;
            align-items: center;
            font-size: 13px;
            .addressText{
                max-width: 80px;
                @include LongtextHidden
            }
        }
        .rightControl{
            flex-grow: 2;
            span{
                font-size: 8px;
                text-align: center;
            }
            .search{
                flex-grow: 1;
            }
            .memberCode{
                flex-grow: 1;
            }
        }
    }
    .border::after{
        width: 290px;
        left: 85px;
        background-color: $bg-color;
    }
    .main{
        position: relative;
        .leftNav{    //左侧导航
            position: absolute;
            left: 0;
            top:0;
            overflow-y: hidden;
        }
        /*右侧内容区域*/
        .rightContent{
            position: absolute;
            left: 85px;
            right: 0;
            top:0;
            bottom: 0;
            width: 290px;
            overflow-y: scroll;
            .swipe{
                padding: 0 10px;
                .van-image{
                    @include radius(8px);
                    overflow: hidden;
                }
            }
            /*商品内容*/
            .goodsContent{
                position: relative;
                .goodsCover{
                    height: 57px;
                    width: 100%;
                }
                .border::after{
                    width: 290px;
                    left: -10px;
                    background-color: $line-color;
                }

            }
        }
        .rightContent::-webkit-scrollbar{
            width: 0;
        }
    }
    .van-sidebar-item--select{
        border-color: #0000;
        color: $main-color;
    }
</style>
