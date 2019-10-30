<template>
    <div class="sharePage" @touchmove.prevent>
        <transition name="fade">
            <button class="shareButton flex row alignCenter" v-if="!order" v-show="!orderShare?!hiddenButton:!orderShare" @click="openShare=true">
                <van-icon name="share" />
                <span>分享</span>
            </button>
        </transition>
        <div class="invite" v-if="orderShare">
            <button class="content" @click.stop="openShare=true" :disabled="disabled" :class="disabled?'disabled':''">
                <van-icon name="share" size="16px" color="white" v-if="!disabled"/>
                <div class="countTime" v-if="!disabled">
                    <span>邀请好友参团</span>
                    <van-count-down :time="time" ref="countDown" :auto-start="autoPlay" class="countTimeContent"  @finish="disabled=true">
                        <template v-slot="timeData">
                            <span class="item">{{ timeData.hours<10?`0${timeData.hours}`: timeData.hours }}:</span>
                            <span class="item">{{ timeData.minutes<10?`0${timeData.minutes}`: timeData.minutes}}:</span>
                            <span class="item">{{ timeData.seconds<10?`0${timeData.seconds}`: timeData.seconds}}</span>
                        </template>
                    </van-count-down>
                    <span>后结束</span>
                </div>
                <div class="countTime" v-else>
                    <span>拼团时间已到</span>
                </div>
            </button>
        </div>
        <transition name="slide">
            <div class="footerControl flex column " v-show="openShare" :class="order?'orderIndex':''">
                <div class="shareMode border flex row justCenter">
                    <div class="item flex column alignCenter justCenter" v-for="(item,index) in shareMode" :key="index" @click.stop="to(item.url)">
                        <i class="iconfont" :class="item.icon"></i>
                        <span>{{item.text}}</span>
                    </div>
                </div>
                <button class="cancel paddingTB" @click.stop="close">
                    取消
                </button>
            </div>
        </transition>
        <transition name="slideInner">
            <div class="poster flex column alignCenter justCenter" v-show="openPoster" :class="order?'orderIndex':''">
                <van-icon class="close" name="cross" size="4.5vw" color="#7a7a7a" @click.stop="openPoster=false"/>
                <div class="posterPainter"  ref="posterPainter">

                </div>
                <button class="savePoster" @click.stop="save">保存图片</button>
                <span>下载图片后可分享至朋友</span>
            </div>
        </transition>
        <van-overlay
                :show="openShare"
                @click="close"
                :z-index="order?10:5"
        />
        <div id="qrCode"  ref="qrCode" style="display: none"></div>
    </div>
</template>
<script>
    import QRCode from 'qrcodejs2'
    import {Icon,Overlay,CountDown,Toast} from 'vant'
    import {mapState} from 'vuex'
    import Vue from 'vue'
    import NativeShare from 'nativeshare'
    Vue.use(Icon).use(Overlay).use(CountDown).use(Toast);
    export default{
        data(){
            return {
                hiddenButton: false,
                openShare: false,
                openPoster: false,
                devicePixelRatio: 0,
                canvas: '',
                centerX: 0,
                centerY: 0,
                flag:0,
                time:null,
                autoPlay:false,
                disabled:false,
                shareMode: [{
                    text: '分享到微信',
                    icon: 'icon-weiChar',
                    url: 'weiChar'
                }, {
                    text: '生成海报',
                    icon: 'icon-poster',
                    url: 'poster'
                }
                ],
            }
        },
        props:{
            isCollage:{
                type:Boolean,
                default:false
            },
            orderShare:{
                type:Boolean,
                default:false
            },
            countTime:{
                type:Number,
                default:0
            },
            order:{
                type:Boolean,
                default:false
            }
        },
        destroyed(){
          window.removeEventListener('scroll',this.shareScroll);
          this.$store.dispatch('share/ClearShare');
        },
        mounted(){
            window.addEventListener('scroll',this.shareScroll);
        },
        computed:{
            ...mapState('share',['share'])
        },
        watch:{
            openPoster(){
                if(this.openPoster){
                    if(this.flag==0){
                        this.init(this.share.qrCodeText||'');
                        this.drawImg(5,55,200,this.share.mainImageUrl||'');
                        this.drawText(this.share.nameAndDesc||'',20,290,12,'black',120,2);
                        this.drawText(this.share.spec||'',20,325,10,'#7a7a7a',120,2);
                        this.drawText('￥',20,350,12,'#19A251');
                        this.drawText(this.share.realPrice||'',30,350,22,'#19A251');
                        this.drawText('￥',95,354,8,'#7a7a7a');
                        this.drawText(this.share.price||'',103,354,8,'#7a7a7a');
                        this.drawLine(95,353,125,353);
                        this.drawCode(170,285,60);
                        this.drawText('识别二维码去购买',168,354,8,'#7a7a7a');
                        if(this.isCollage){
                            this.drawRect(92.5,318,32,12,'#19a251');
                            this.drawText(`${this.share.mode}人团`||'',95,325,10,'white');
                            this.drawText(`活动时间: ${this.share.timeLimit}`||'',this.centerX,265,10,'orange');
                        }
                        this.flag++;
                    }
                }
            },
            countTime(val,oldval){
                if(val!==oldval){
                    if(val>0){
                        this.time=this.countTime;
                    }else {
                        this.time=0;

                    }
                    this.autoPlay=true;
                }
            }
        },
        methods:{
            shareScroll(){
                const scrollTop=document.documentElement.scrollTop||document.body.scrollTop||window.pageYOffset;
                if(scrollTop>=350){
                   this.hiddenButton=true;
                }else {
                    this.hiddenButton=false;
                }
            },
            to(url){
                switch (url){
                    case 'poster':
                       this.openPoster=true;
                        break;
                    case 'weiChar':
                        const nativeShare = new NativeShare();
                        nativeShare.setShareData({
                            icon:  this.share.mainImageUrl,
                            link: `http://sunnyboy1994.gitee.io/practice/fruitShop/dist/#${this.$route.fullPath}`,
                            title: this.share.nameAndDesc,
                            desc: `￥${this.share.realPrice}`,
                            from: '@fa-ge',
                        });
                        try {
                            nativeShare.call()
                        } catch(err) {
                              alert(err)
                        }
                        break;

                }
            },
            initCanvas(){
                let box=this.$refs.posterPainter;
                this.canvas=document.createElement('canvas');
                this.devicePixelRatio = window.devicePixelRatio==3?3:window.devicePixelRatio || 2;
                let canvasWidth=250;
                let canvasHeight=375;
                this.canvas.width=canvasWidth*this.devicePixelRatio;
                this.canvas.height=canvasHeight*this.devicePixelRatio;
                this.canvas.style.width=(canvasWidth/3.75)+'vw';
                this.canvas.style.height=(canvasHeight/3.75)+'vw';
                this.centerX=this.canvas.width/2;
                this.centerY=this.canvas.width/2;
                box.appendChild(this.canvas);
            }, //初始化画布
            codeInit(url){
                let qrcode = new QRCode('qrCode', {
                    width: 100,
                    height: 100,
                    text:url
                })
            }, //初始化二维码
            drawText(text,x,y,fontSize,style,maxWidth,lineNum){
                let ctx=this.canvas.getContext('2d');
                ctx.fillStyle = style;
                ctx.textBaseline = "middle";
                ctx.font =`${fontSize*this.devicePixelRatio}px Arial`;
                if(maxWidth){
                    let lineText='';//每一行文本
                    let row=[];
                    ctx.textAlign='start';
                    const allText=text.split('');
                    for(let i=0;i<allText.length;i++){
                        if(ctx.measureText(lineText).width/this.devicePixelRatio>maxWidth){
                            row.push(lineText);
                            lineText='';
                        }
                        lineText+=allText[i];
                    }
                    row.push(lineText);
                    if(row.length>lineNum){
                       row.splice(lineNum,row.length-lineNum);
                       row[lineNum-1]=row[lineNum-1]+'...'
                    }
                   for(let i=0;i<row.length;i++){
                        if(i!==0){
                            y=y+fontSize+5;
                        }
                       ctx.fillText(row[i],x*this.devicePixelRatio,y*this.devicePixelRatio);
                   }
                }else {
                    if(x==this.centerX){
                        ctx.textAlign='center';
                        ctx.fillText(text,this.centerX,y*this.devicePixelRatio);
                    }else {
                        ctx.textAlign='start';
                        ctx.fillText(text,x*this.devicePixelRatio,y*this.devicePixelRatio);
                    }
                }
                ctx.save();
                ctx.beginPath();
            }, //绘制文字
            drawImg(x,y,length,url,isCode){
                let img=new Image();
                const ctx=this.canvas.getContext('2d');
                img.crossOrigin='anonymous';
                let imgWidth;
                let imgHeight;
                if(!isCode){
                    img.onload= ()=> {
                        const ratio=img.width/img.height;
                        imgWidth=length*ratio*this.devicePixelRatio;
                        imgHeight=length*this.devicePixelRatio;
                        if(imgWidth>250*this.devicePixelRatio){
                            ctx.drawImage(img,0,y*this.devicePixelRatio,imgWidth,imgHeight);
                        }else {
                            ctx.drawImage(img,(250*this.devicePixelRatio-imgWidth)/2,y*this.devicePixelRatio,imgWidth,imgHeight);
                        }
                        ctx.save();
                        ctx.beginPath();
                    };
                }else {
                    imgWidth=length*this.devicePixelRatio;
                    imgHeight=length*this.devicePixelRatio;
                    img.onload= ()=> {
                        ctx.drawImage(img,x*this.devicePixelRatio,y*this.devicePixelRatio,imgWidth,imgHeight);
                        ctx.save();
                        ctx.beginPath();
                    };
                }
                img.src=url;

            }, //绘制图片
            drawLine(moveX,moveY,lineToX,lineToY){
                const ctx=this.canvas.getContext('2d');
                ctx.moveTo(moveX*this.devicePixelRatio,moveY*this.devicePixelRatio);
                ctx.lineTo(lineToX*this.devicePixelRatio,lineToY*this.devicePixelRatio);
                ctx.stroke();
                ctx.save();
            }, //绘制线
            drawCode(x,y,length){
                const ctx=this.canvas.getContext('2d');
                ctx.strokeStyle="#19a251";
                ctx.lineWidth=2;
                ctx.strokeRect(x*this.devicePixelRatio,y*this.devicePixelRatio,length*this.devicePixelRatio,length*this.devicePixelRatio);
                const url=this.$refs.qrCode.childNodes[0].toDataURL("image/png");
                this.drawImg(x+1,y+1,length-2,url,true)

            }, //绘制二维码
            drawRect(x,y,width,height,style){
                const ctx=this.canvas.getContext('2d');
                ctx.rect(x*this.devicePixelRatio,y*this.devicePixelRatio,width*this.devicePixelRatio,height*this.devicePixelRatio);
                ctx.fillStyle=style;
                ctx.fill();
            },
            init(codeText){
                this.initCanvas();
                this.codeInit(codeText);
                this.drawRect(0,0,this.canvas.width,this.canvas.height,'white');
                this.drawText('千果汇',this.centerX,25,14,'#19A251');
                this.drawText('好吃就在千果汇，不好吃三无退货',this.centerX,45,8,'#7a7a7a');
            }, //初始化操作
            save(){
                const imgData=this.canvas.toDataURL("image/png");
                this.downLoad(imgData,this.share.nameAndDesc);
                this.openPoster=false;
                this.close();
            },
            downLoad(url,name){
                const a=document.createElement('a');
                a.download=name;
                a.href=url;
                document.body.appendChild(a);
                Toast.success({
                    duration: 800,
                    message: '请在浏览器下载文件夹中查看'
                });
                a.click();
                a.remove();
            },
            close(){
                this.openShare=false;
                if(this.order){
                    this.$emit('openTabbar',false)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .sharePage{

    }
    .fixed{

    }
    @font-face {
        font-family: 'iconfont';  /* project id 1353777 */
        src: url('//at.alicdn.com/t/font_1353777_w177jlrccq.eot');
        src: url('//at.alicdn.com/t/font_1353777_w177jlrccq.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1353777_w177jlrccq.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1353777_w177jlrccq.woff') format('woff'),
        url('//at.alicdn.com/t/font_1353777_w177jlrccq.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1353777_w177jlrccq.svg#iconfont') format('svg');
    }
    .iconfont {
        font-family: "iconfont";
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .icon-poster:before {
        content: "\e600";
        font-size: 35px;
        color: $main-color;
    }
    .icon-weiChar:before {
        content: "\e601";
        font-size: 35px;
        color: $weiChar-color;
    }
    .shareButton{
        position: fixed;
        right: 0;
        z-index: 2;
        top:60px;
        padding:3px 10px 3px 5px;
        @include radius(10px 0px 0px 10px );
        @include reloadButton;
        background-color: gold;
        font-size: 12px;
        span{
            margin-left: 3px;
        }
    }
    .footerControl{
        position: fixed;
        bottom: 0;
        z-index: 7;
        width: 100%;
        height: 180px;
        background-color: white;
        .shareMode{
            height: 130px;
            width: 100%;
            .item{
                position: relative;
                width: 50%;
                span{
                    display: inline-block;
                    margin-top: 10px;
                    font-size: 14px;
                    color: $text-color;
                }
            }
            .item:first-child:before{
                display: none;
            }
            .item:before{
                position: absolute;
                content: '';
                left:0;
                top:50%;
                @include transformY(-50%);
                height: 80px;
                width: 1px;
                background-color: $line-color;
            }
        }
        .border:after{
            background-color: #f5f5f5;
        }
        .cancel{
            height: 50px;
            @include reloadButton;
            font-size: 18px;
            text-align: center;
        }
    }
    .poster{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 80%;
        background-color: white;
        z-index: 9;
        .close{
            position: absolute;
            right: 15px;
            top:25px;
        }
        .posterPainter{
            width:  250px;
            height: 375px;
            box-shadow: 0 0 5px $line-color;
            -webkit-box-shadow:0 0 5px $line-color;
            -moz-box-shadow: 0 0 5px $line-color;
            -o-box-shadow:0 0 5px $line-color ;
            box-sizing: border-box;
        }
        .savePoster{
            @include reloadButton;
            @include radius(30px);
            padding:10px ;
            width: 250px;
            font-size: 18px;
            background-color: $main-color;
            margin-top: 15px;
            color: white;
        }
        span{
            margin-top: 5px;
            color: $text-color;
            font-size: 14px;
        }
    }
    .orderIndex{
        z-index:11;
    }
    .invite{
        margin-top:15px;
        margin-bottom:15px;
        padding:10px 15px;
        background-color: white;
        .content{
            @include reloadButton;
            @include radius(37.5px);
            width: 100%;
            padding:10px 10px;
            background-color: #ed9400;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .countTime{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-left: 25px;
                .countTimeContent{
                    height:24px;
                    line-height: 24px;
                    text-align: center;
                    color: white;
                    font-size: 18px;
                    margin-right: 5px;
                }
            }
            span{
                font-size: 16px;
                color: white;
            }
            .countTime>span:first-child{
                margin-right: 5px;
            }
        }
        .disabled{
            background-color: gainsboro;
        }
    } //邀请操作
    .slide-enter-active{
          @include slideUp(180px)
    }
    .slide-leave-active{
        @include slideDown(180px)
    }
    .slideInner-enter-active{
        @include slideUp(80%)
    }
    .slideInner-leave-active{
        @include slideDown(80%)
    }
    .fade-enter-active{
        @include fadeIn
    }
    .fade-leave-active{
        @include fadeOut
    }
</style>