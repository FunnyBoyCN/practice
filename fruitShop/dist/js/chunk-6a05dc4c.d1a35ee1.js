(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6a05dc4c"],{1203:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"shopOrderView marginTop",on:{click:t.toDetail}},[a("order-top",{attrs:{icon:"shop-o",orderTime:"2018-08-10 17:07:54",state:{}}}),a("div",{staticClass:"goods border paddingLR"},t._l(3,function(e){return a("div",{staticClass:"item flex row spaceBetween "},[a("span",[t._v("A级-进口银火龙果（中）")]),a("span",[t._v("0.49公斤")])])}),0),a("order-total",{attrs:{totalNum:0,totalPrice:"5.73"}}),a("div",{staticClass:"orderButton flex row spaceBetween paddingTB"},[a("order-tip"),t._m(0)],1)],1)])},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"buttonGroup"},[a("button",[t._v("售后退款")]),a("button",[t._v("联系店家")])])}],n=a("39b2"),c=a("e242"),i=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},o=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("span",{staticClass:"tip css1b7768ea9a20470"},[t._v("订单超过7天无法瞬间退款")])])}],l=(a("638d"),a("2877")),u={},d=Object(l["a"])(u,i,o,!1,null,"55979ef5",null),f=d.exports,p={components:{orderTop:n["a"],orderTotal:c["a"],orderTip:f},methods:{toDetail:function(){this.$router.push({path:"/Orders/orderDetail",query:{name:"shopOrder"}})}}},b=p,v=(a("c2df"),Object(l["a"])(b,r,s,!1,null,"5622dd8b",null));e["default"]=v.exports},"1b8e":function(t,e,a){"use strict";var r=a("272d"),s=a.n(r);s.a},"272d":function(t,e,a){},"2b6c":function(t,e,a){},"39b2":function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"topMs flex row spaceBetween alignCenter"},[a("div",{staticClass:"time  border flex row alignCenter"},[a("van-icon",{attrs:{name:t.icon,size:"4vw",color:"#7a7a7a"}}),a("span",{staticClass:" marginFontLeft"},[t._v(t._s(t.orderTime))])],1),a("span",{staticClass:"state",class:t.stateClass(t.state)},[t._v(t._s(t.stateText(t.state)))])])},s=[],n=a("2b0e"),c=a("ad06");n["a"].use(c["a"]);var i={data:function(){return{}},props:["icon","state","orderTime"],computed:{stateText:function(){return function(t){var e;switch(t){case-1:e="订单已取消";break;case 0:e="订单未付款";break;case 1:e="订单已付款";break;case 2:e="订单送货中";break;case 3:e="订单已收货";break}return e}},stateClass:function(){return function(t){var e;switch(t){case-1:e="cancel";break;case 0:e="pending";break;case 1:e="done";break;case 2:e="done";break;case 3:e="done";break}return e}}}},o=i,l=(a("1b8e"),a("2877")),u=Object(l["a"])(o,r,s,!1,null,"838c6130",null);e["a"]=u.exports},"638d":function(t,e,a){"use strict";var r=a("c035"),s=a.n(r);s.a},b1b5:function(t,e,a){},c02d:function(t,e,a){"use strict";var r=a("2b6c"),s=a.n(r);s.a},c035:function(t,e,a){},c2df:function(t,e,a){"use strict";var r=a("b1b5"),s=a.n(r);s.a},d57d:function(t,e,a){},e242:function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"total paddingTB flex row flexEnd alignCenter border"},[a("span",[t._v("共 "+t._s(t.totalNum)+" 件商品 总价：")]),a("real-price",{attrs:{big:18,small:14,text:t.totalPrice,isEnd:!0,beforeSize:18}})],1)},s=[],n=a("eafd"),c={props:["totalNum","totalPrice"],components:{realPrice:n["a"]}},i=c,o=(a("fc02"),a("2877")),l=Object(o["a"])(i,r,s,!1,null,"adcb0a7e",null);e["a"]=l.exports},eafd:function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{ref:"price",staticClass:"flex row price",class:t.isEnd?"alignEnd":"",style:{color:t.color}},[a("div",{staticClass:"big",class:t.beforeSize?" ":"bigSize",style:{fontSize:t.big+"px"}},[t._v(t._s(t.PriceTranForm(t.text)[0]))]),a("div",{staticClass:"small",style:{fontSize:t.small+"px"}},[t._v("."+t._s(t.PriceTranForm(t.text)[1]))])])},s=[],n=(a("6b54"),a("28a5"),{props:["big","small","text","color","isEnd","beforeSize"],computed:{PriceTranForm:function(){return function(t){return t?t.toString().split("."):["",""]}}}}),c=n,i=(a("c02d"),a("2877")),o=Object(i["a"])(c,r,s,!1,null,"b275d454",null);e["a"]=o.exports},fc02:function(t,e,a){"use strict";var r=a("d57d"),s=a.n(r);s.a}}]);
//# sourceMappingURL=chunk-6a05dc4c.d1a35ee1.js.map