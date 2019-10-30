<template>
    <div class="ownInfoView">
       <navbar :navbarTitle="'个人信息'"/>
        <div class="item avatar marginTop" @click.stop="open=true;avatar=true">
            <img
                 :src="memberAvatar"
                 width="55"
                 height="55"
                 class="avatarImage"
            />
            <div class="checkAvatar">
                <span>我的头像</span>
                <van-icon name="arrow" class="icon" size="16px"/>
            </div>
        </div>
        <div class="item " v-for="(value, key, index) in memberMs">
            <span>{{ title(key) }}</span>
            <span>{{ value }}</span>
        </div>



        <transition name="slide">
        <div class="avatarOperation" v-show="avatar">
            <template v-for="(item,index) in avatarOperation">
                <button @click.stop="item.method">{{item.text}}</button>
            </template>
        </div>
        </transition>
        <van-overlay :show="open" @click="open=false;imageConfirm=false;avatar=false" />
        <div class="imageConfirm" ref="imageConfirm" v-show="imageConfirm">
            <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixedBox="true"
                    :centerBox="true"
                    :canMoveBox="false"
                    class="cropper"
            ></vueCropper>
            <div class="buttonGroup">
               <div class="item">
                   <button class="confirmButton" @click.stop="chooseConfirm">确认</button>
                   <button class="cancelButton"  @click.stop="chooseCancel">取消</button>
               </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {Icon,Overlay,ImagePreview,Toast} from 'vant'
    import {api} from '../../utils/api'
    import EXIF from 'exif-js'
    import Vue from 'vue'
    import { VueCropper }  from 'vue-cropper'
    Vue.use(Icon).use(Overlay).use(ImagePreview).use(Toast);
    import navbar from '../../components/navbar.vue'
    export default{
        components:{
            navbar,
            VueCropper
        },
        data(){
            return{
                memberMs:{},
                memberAvatar:'',
                open:false,
                avatarOperation:[{
                    text:'查看大图',
                    method:this.checkAvatar
                },{
                    text:'更改头像',
                    method:this.changeAvatar
                }],
                imageConfirmHeight:0,
                imageConfirm:false,
                avatar:false,
                img:'',
                angle:0,
                dataUrl:'',
                option:{

                }
            }
        },
        inject:['reload'],
        methods:{
            checkAvatar(){
                ImagePreview([this.memberAvatar]);
            },
            changeAvatar(){
               this.createdUpload().then(res=>{  //创建标签接收文件
                    return this.readerFile(res); //读取图像转换成base 64
               }).then(res=> {
                   this.option.img=res;
                   this.option.outputSize=1;
                   this.option.outputType='jpeg';
                   this.option.autoCrop=true;
                   this.option.autoCropWidth=document.documentElement.clientWidth*0.8;
                   this.option.autoCropHeight=document.documentElement.clientWidth*0.8;
                   this.imageConfirm = true;
               })
            },
            createdUpload(){
                return new Promise((resolve)=>{
                    const uploadInput=document.createElement('input');
                    uploadInput.setAttribute('type','file');
                    uploadInput.setAttribute('accept','image/*');
                    uploadInput.style.display='none';
                    document.body.appendChild(uploadInput);
                    uploadInput.click();
                    uploadInput.addEventListener('change',function (result) {
                        const oFile=result.target.files[0];
                        this.avatar=false;
                        resolve(oFile);
                    })
                })
            },
            dataURLtoFile(dataurl, filename) {
                return new Promise((resolve)=>{
                    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                    while(n--){
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    resolve(new File([u8arr], filename, {type:mime}));
                })
             },
            readerFile(file){
                return new Promise((resolve)=>{
                    let reader=new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload=function () {
                        resolve(this.result)
                    };
                })
            },
            chooseConfirm(){
                let toast=Toast.loading({
                    message:'上传中...',
                    mask:false
                });
                this.$refs.cropper.getCropData((data) => {
                    this.dataURLtoFile(data,'avatar').then(res=>{
                        return this.calQuality(res);
                    }).then(res=>{
                        return this.canvasToUrl(data,res);
                    }).then(res=>{
                       return this.dataURLtoFile(res,'user');
                    }).then(res=>{
                        let fd=new FormData();
                        fd.append('avatar',res);
                        api.post('/avatar',fd).then(res=>{
                            toast.clear();
                            this.open=false;
                            this.imageConfirm=false;
                            this.avatar=false;
                            Toast.success('上传成功');
                            let timer=setTimeout(()=>{
                                this.reload();
                                clearTimeout(timer)
                            },800);
                        })
                    })
                })
            }, //确认按钮
            calQuality(file){
                return new Promise((resolve)=>{
                    let quality;
                    let fileSize=Math.floor(file.size/1000);
                    if(fileSize>1000){
                        quality=1000/fileSize
                    }else {
                        quality=0.92
                    }
                    resolve(quality)
                })
            },
            canvasToUrl(url,quality){
                return new Promise((resolve)=>{
                    let img=new Image();
                    img.onload=function () {
                        let canvas=document.createElement('canvas');
                        let ctx=canvas.getContext('2d');
                        canvas.width=img.width;
                        canvas.height=img.height;
                        ctx.drawImage(img,0,0,img.width,img.height);
                        let oFileData=canvas.toDataURL('image/jpeg',quality);
                        resolve(oFileData);
                    };
                    img.src=url;
                })
            },
            chooseCancel(){
              this.imageConfirm=false;
              this.avatar=true;
            },
            init(){
                api.get('/userInfoDetail').then(res=>{
                    this.memberMs=res.result;
                    this.memberAvatar=res.result.avatar;
                    for (let i in this.memberMs){
                        if(i=='avatar'||i=='id'){
                            delete this.memberMs[i];
                        }

                    }
                })
            }
        },
        computed:{
            title(){
                return function (name) {
                    let oName;
                    switch (name){
                        case 'name':{
                            oName='姓名';
                            break;
                        }
                        case 'phone':{
                            oName='电话';
                            break;
                        }
                    }
                    return oName;
                }
            }
        },
        created(){
            this.init();
        },
    }
</script>
<style lang="scss" scoped>
    @font-face {
        font-family: 'iconfont';  /* project id 1353777 */
        src: url('//at.alicdn.com/t/font_1353777_vlz6vt2evo.eot');
        src: url('//at.alicdn.com/t/font_1353777_vlz6vt2evo.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1353777_vlz6vt2evo.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1353777_vlz6vt2evo.woff') format('woff'),
        url('//at.alicdn.com/t/font_1353777_vlz6vt2evo.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1353777_vlz6vt2evo.svg#iconfont') format('svg');
    }
    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-rotate-left:before {
        content: "\e834";
    }

    .icon-rotate-right:before {
        content: "\e836";
    }
    .ownInfoView{
        background-color: $bg-color;
        .item{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding:10px 10px;
            background-color: white;
            margin: 10px 0;
            .avatarImage{
                @include radius(50%)
            }
            .checkAvatar{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                .icon{
                    margin-left: 5px;
                }
            }
        }
        .avatarOperation{
            position: fixed;
            bottom: 0;
            display: flex;
            flex-direction: column;
            width: 375px;
            height: 120px;
            z-index: 2;
            button{
                flex-grow: 1;
                @include reloadButton;
                position: relative;
                background-color: #ffffff;
            }
            button:before{
                position: absolute;
                content: '';
                top:0;
                left: 0;
                width: 100%;
                height: 1px;
                background-color: $line-color;
            }
        }
        .imageConfirm{
            position: fixed;
            top: 0;
            left: 0;
            width: 375px;
            background-color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 12;
            height: 100vh;
            overflow-y: scroll;
            .cropper{
                background-image: none;
                background-color: black;
                .cropper-crop-box{
                    @include radius(50%);
                    .cropper-view-box{
                        outline: none  !important;
                        @include radius(50%);
                    }
                    .cropper-face{
                        @include radius(50%);
                    }
                }

            }
            .ConfirmImage{
                width: 100%;
                border:1px solid $line-color;

            }
            .buttonGroup{
                position: fixed;
                bottom: 0;
                left: 0;
                display: flex;
                flex-direction: column;
                width: 355px;
                overflow: hidden;
                background-color: transparent;
                z-index: 13;
                .item{
                    display: flex;
                    flex-direction: row;
                    padding:20px 10px;
                    margin: 0;
                    width: 100%;
                    justify-content: space-around;
                    background: rgba(0,0,0,0.1);
                    button{
                        @include reloadButton;
                        background: transparent;
                        color: white;
                    }
                }
            }
        }
    }
    .slide-enter-active{
        @include slideUp(120px)
    }
    .slide-leave-active{
        @include slideDown(120px)
    }
    .slideInner-enter-active{
        @include slideUp(80%)
    }
    .slideInner-leave-active{
        @include slideDown(80%)
    }
</style>