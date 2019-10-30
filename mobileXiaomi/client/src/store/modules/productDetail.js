/**
 * Created by sun77 on 2019/4/10.
 */
import {api} from "../../utils/api"
const  state={
    product:[],
};
const mutations={
    Product(state,data){
        state.product=data;
        if(state.product.pid==='1'){
            state.product.hardWare=[{
                img:'https://cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/f0c04e138bfed2b1ebb589de615236d1.png',
                name:'CPU',
                detail:'骁龙660八核'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/7692726e7a1dd34a3b1b4ede8aca020d.png',
                name:'双摄像头',
                detail:'1200万+500万像素'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/86a3bd46cf4f7f19daa2c3250cf30604.png',
                name:'超大屏',
                detail:'6.26英寸'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/a5ab24dcb527e49f970f13b11e000ab1.png',
                name:'屏幕分辨率',
                detail:'2280×1080'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/c8ec0829241324e401744da627482560.png',
                name:'极速畅玩',
                detail:'6GB'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/8941adac25333e785b9cc78ca11f4f27.png',
                name:'存储容量',
                detail:'64GB'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/52ad10a73685342e437e44ea3d29cbff.png',
                name:'薄',
                detail:'7.5mm'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/0b4ea0fb21dde2f29df3c20de73539b9.png',
                name:'持久待机',
                detail:'3350mAh'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/d1b67a407fb2a1ed42c2c0ce15af3318.png',
                name:'运营商网络',
                detail:'4G全网通'
            },{
                img:'https://i8.mifile.cn/b2c-mimall-media/bfd5ba9ae72c365dee42db14dfae4b0f.png',
                name:'网络模式',
                detail:'双卡双待'
            }
            ]
        }
    }
};
const actions={
    getProduct(context,data){
      return api.get(`/productDetail?${data}`).then(response=>{
            context.commit("Product",response);
        })

    }
};
export  default{
    namespaced:true,
    state,mutations,actions
}