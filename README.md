
## 个人项目  ： [水果商城](#fruitShop) [小米商城](#xiaomi)  [关于我](#关于我) 

---

<a name="返回顶部"></a>
<html>
<center>
<h3>水果商城（基于VUE和node.js开发的移动端）<a href="http://sunnyboy1994.gitee.io/practice/fruitShop/dist/">
在线体验
</a>
</h1>
</center>
</html>
<a name="fruitShop"></a>

### 导航  ： [技术栈](#技术栈) [目录结构](#目录结构)  [客户端功能](#客户端功能) [快速预览](#快速预览)  [特别感谢](#特别感谢)


----------
### 技术栈

<a name=“技术栈”></a>

1. #### 客户端 （移动端）
    - ##### vue全家桶
    - ##### axios 
    - ##### promise  &nbsp; &nbsp;异步编程
    - ##### postcss-px-to-viewport  &nbsp; &nbsp;移动端适配工具
    - ##### vant-UI  &nbsp; &nbsp;快速构建UI组件
    - ##### vue-cropper &nbsp; &nbsp;图像裁切库
    - ##### qrcodejs2   &nbsp; &nbsp;二维码生成库
    - ##### jsbarcode   &nbsp; &nbsp;条形码生成库
    - ##### better-scroll  &nbsp; &nbsp;滚动插件
2. #### 服务端 （node.js）
    - ##### express  &nbsp; &nbsp;基于node.js的web开发框架
    - ##### mongoDB &nbsp; &nbsp;非关系型数据库
    - ##### mongoose &nbsp; &nbsp;操作mongoDB的框架
    - ##### jsonwebtoken &nbsp; &nbsp;token认证
    - ##### multer &nbsp; &nbsp;处理文件上传库
    - ##### 聚合数据 &nbsp; &nbsp;用户验证码
3. #### 服务器及部署
    - ##### 阿里云服务器
    - ##### pm2  &nbsp; &nbsp;node进程管理
    - ##### 宝塔面板 &nbsp; &nbsp;云服务器配置和文件管理

----------

### 目录结构

<a name=“目录结构”></a>

```
├─client                //客户端  (vue.js)
│  ├─public            
│  └─src                //主要文件代码
│      ├─assets           //静态资源
│      ├─components          //组件
│      │  ├─account            //钱包组件
│      │  ├─checkout           //结算组件   
│      │  ├─collage            //拼团商品组件
│      │  ├─member             //会员组件
│      │  ├─order              //订单组件  
│      │  ├─orderDetail        //订单详情组件
│      │  └─pay                //支付组件
│      ├─skeleton            //骨架屏    
│      │  ├─components         //骨架屏组件    
│      │  └─views              //骨架屏界面
│      ├─store               //vuex
│      │  └─modules            //vuex模块
│      ├─style               //全局样式
│      ├─utils               //工具
│      └─views               //商城页面
│          ├─Collage           //拼团商品页  
│          ├─Common            //公共页面
│          ├─Home              //首页  
│          ├─Member            //会员页面
│          ├─networkFail       //网络异常页面
│          ├─Orders            //订单页面（包含拼团订单和普通商品订单）
│          │  └─views
│          ├─pay               //支付页面
│          ├─Search            //搜索页面  
│          └─Shop              //附近商店页面
└─server                  //服务端  （node.js）     
    ├─Avatar                //用户头像图片
    ├─controller            //客户端api和后台管理（待完善）api
    ├─GoodImg               //商品图片
    │  ├─common               //公共的商品图片
    │  └─events               //活动页商品图片
    ├─modules                //MongoDB数据库模型
    ├─routes                //api路由
    │  ├─admin                //后台管理端路由（待完善）
    │  └─user                 //客户端路由
    └─utils                 //工具类
        ├─images              //图片文件类
        └─user                //用户其他类

```

-------








### 客户端功能 

<a name=“客户端功能”></a>

```
graph LR
FruitShop-->主页
主页-->搜索
主页-->商品展示
商品展示-->商品详情
商品展示-->商品分享
主页-->附近商店地址
主页-->会员码


FruitShop-->拼团商品
拼团商品-->拼团商品展示
拼团商品展示-->商品详情
拼团商品展示-->商品分享
拼团商品-->附近商店地址
拼团商品-->搜索

FruitShop-->订单页
订单页-->普通商品订单
订单页-->拼团商品订单
拼团商品订单-->订单取消
拼团商品订单-->订单重购
拼团商品订单-->订单付款
拼团商品订单-->订单分享
拼团商品订单-->订单取货码查看
拼团商品订单-->联系店家
普通商品订单-->订单取消
普通商品订单-->订单重购
普通商品订单-->订单付款
普通商品订单-->联系店家

附近商店地址-->商店列表
商店列表-->商店详情
商店详情-->地理位置查看
FruitShop-->会员页
会员页-->登录/注册/短信验证码
会员页-->会员头像查看和更改
会员页-->会员积分
会员页-->优惠券
会员页-->钱包充值
会员页-->签到
会员页-->会员码
会员页-->地址管理
会员页-->修改密码

```
### 服务端功能

```
graph LR

api接口-->后台管理api
api接口-->客户端api
后台管理api-->商品模型的增删改查
客户端api-->用户登录/注册验证
客户端api-->用户信息查看&修改
客户端api-->用户头像处理
客户端api-->用户钱包查看&充值
客户端api-->用户会员码生成
客户端api-->用户积分
客户端api-->商品查看
客户端api-->商品活动
客户端api-->商品搜索
客户端api-->订单下单&取消
客户端api-->订单未付款自动取消
客户端api-->订单退款
客户端api-->检查库存
```
-----

### 快速预览
<a name="#快速预览"></a>
![alt 主页](https://www.z4a.net/images/2019/10/30/home.md.png "fruitShop")
---
![alt 拼团](https://www.z4a.net/images/2019/10/30/collage.md.jpg "fruitShop")
---
![alt 订单](https://www.z4a.net/images/2019/10/30/order.png "fruitShop")
---
![alt 会员](https://www.z4a.net/images/2019/10/30/member.png "fruitShop")
---
[![alt 商品](https://www.z4a.net/images/2019/10/30/goods.png)](https://www.z4a.net/image/UYLS56)
[![alt 会员码](https://www.z4a.net/images/2019/10/30/memberCode.png)](https://www.z4a.net/image/UYL8Ov)
[![alt 分享](https://www.z4a.net/images/2019/10/30/share.png)](https://www.z4a.net/image/UYLC4n)
[![alt 签到](https://www.z4a.net/images/2019/10/30/sign.png)](https://www.z4a.net/image/UYLcrT)
[![alt 地图](https://www.z4a.net/images/2019/10/30/map.png)](https://www.z4a.net/image/UYLKQH)

-----

---
### 特别感谢
<a name="特别感谢"></a>

#### [vant UI](https://github.com/youzan/vant)


---

<html>
<center>
<h3>小米商城移动端（基于VUE和node.js开发的移动端）<a href="http://sunnyboy1994.gitee.io/practice/mobileXiaomi/dist/index.html#/">
在线体验
</a>
</h1>
</center>
</html>

<a name="xiaomi"></a>

### 导航  ： [技术栈](#小米技术栈) [目录结构](#小米目录结构)  [客户端功能](#小米客户端功能) [服务端功能](#小米服务端功能) [快速预览](#小米快速预览) 


----------
### 技术栈

<a name=“小米技术栈”></a>

1. #### 客户端 （移动端）
    - ##### vue全家桶
    - ##### axios 
    - ##### promise  &nbsp; &nbsp;异步编程
    - ##### postcss-px-to-viewport  &nbsp; &nbsp;移动端适配工具
    - ##### vant-UI  &nbsp; &nbsp;快速构建UI组件
    - ##### qrcodejs2   &nbsp; &nbsp;二维码生成库
2. #### 服务端 （node.js）
    - ##### express  &nbsp; &nbsp;基于node.js的web开发框架
    - ##### mongoDB &nbsp; &nbsp;非关系型数据库
    - ##### mongoose &nbsp; &nbsp;操作mongoDB的框架
    - ##### multer &nbsp; &nbsp;处理文件上传库
3. #### 服务器及部署
    - ##### 阿里云服务器
    - ##### pm2  &nbsp; &nbsp;node进程管理
    - ##### 宝塔面板 &nbsp; &nbsp;云服务器配置和文件管理

----------

### 目录结构

<a name=“小米目录结构”></a>

```
├─client        //客户端
│  ├─public
│  └─src        
│      ├─assets   //静态文件
│      ├─components //组件
│      ├─data       
│      ├─img        
│      ├─store      //vuex
│      │  └─modules //模型  
│      ├─utils      //工具
│      └─views      //视图
└─server
    ├─modules       //数据库模型
    └─utils         //工具


```

-------


### 客户端功能 

<a name=“小米客户端功能”></a>

```
graph LR
小米商城-->主页
主页-->搜索
主页-->商品展示
商品展示-->商品详情
商品展示-->商品评论
商品评论-->评论点赞
商品展示-->商品购买
小米商城-->商品分类
小米商城-->购物车
购物车-->结算
结算-->地址管理
小米商城-->个人页面
个人页面-->订单详情
订单详情-->订单评论
个人页面-->登录注册

```
### 服务端功能
<a name="#小米服务端功能"></a>
```
graph LR

api接口-->客户端api
客户端api-->用户订单详情
客户端api-->商品详情 
客户端api-->商品分类详情
客户端api-->登录&注册
客户端api-->订单结算
客户端api-->购物车
客户端api-->商品搜索
```
-----

### 快速预览
<a name="#小米快速预览"></a>
[![xiaomiHome.png](https://www.z4a.net/images/2019/10/30/xiaomiHome.png)](https://www.z4a.net/image/UYcFd0)
[![classi.png](https://www.z4a.net/images/2019/10/30/classi.png)](https://www.z4a.net/image/UYcRNa)
[![check.png](https://www.z4a.net/images/2019/10/30/check.png)](https://www.z4a.net/image/UYcvKA)
[![search.png](https://www.z4a.net/images/2019/10/30/search.png)](https://www.z4a.net/image/UYc5UK)
[![searchDetail.png](https://www.z4a.net/images/2019/10/30/searchDetail.png)](https://www.z4a.net/image/UYcZXJ)
[![xiaomigoods.png](https://www.z4a.net/images/2019/10/30/xiaomigoods.png)](https://www.z4a.net/image/UYcGjr)
[![xiaomilogin.png](https://www.z4a.net/images/2019/10/30/xiaomilogin.png)](https://www.z4a.net/image/UYcaGO)
[![xiaomiOrder.png](https://www.z4a.net/images/2019/10/30/xiaomiOrder.png)](https://www.z4a.net/image/UYcKCj)

-----

### About me 关于我
<a name="关于我"></a>

```javascript
const me={
    name:"SunFangJing",
    email:"1011223445@qq.com"
}
```


<div style="text-align: right"> <a href="#返回顶部">返回顶部</a> </div>

