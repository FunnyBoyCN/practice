<template>
    <div>
        <back-nav :title="'商品评价'"></back-nav>
        <div class="main">
            <title-text :titleName="'商品内容'"></title-text>
            <div class="padding bgWhite row  alignCenter">
                <template v-if="shopContent.imgs">
                <van-image
                        width="50"
                        height="50"
                        class="imgBorder"
                        :src="shopContent.imgs[0]"
                        @click="ImagePreview(shopContent.imgs)"
                />
                </template>
                <span class="fontMarginLeft NormalFont">{{shopContent.name}}</span>
            </div>
            <div class="marginTop bgWhite ">
                <title-text :titleName="'选择星级'"></title-text>
                <div class="padding row alignCenter justContentCenter">
                    <van-rate v-model="value" @change="showStar" :allow-half="true"/>
                </div>
            </div>
            <div class="marginTop bgWhite">
                <title-text :titleName="'填写评论'"></title-text>
                <div class="padding column">
                    <div class="row">
                        <van-uploader
                                v-model="fileList"
                                multiple
                                :max-count="1"
                                :after-read="afterRead"
                                :preview-image="true"
                                :before-read="beforeRead"
                        />
                    </div>
                    <van-field
                            v-model="textContent"
                            placeholder="请填写评论"
                            type="textarea"
                            :clearable="true"
                            :clickable="true"
                            autosize
                            required
                            class="doubleBorder marginTop"
                    />
                </div>
            </div>
            <div class="marginTop bgWhite padding-leftAndRight bottomHeight row  flexBetween alignCenter">
                <van-checkbox v-model="isAnonymous">匿名评论</van-checkbox>
                <van-button type="danger" @click="commit">提交</van-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {Image,ImagePreview,Rate,Toast,Uploader,Field,Button,Checkbox} from 'vant'
    import {api} from '../utils/api'
    import {myApi} from '../utils/myApi'
    import Vue from 'vue'
    import 'vant/lib/image/style'
    import 'vant/lib/image-preview/style'
    import 'vant/lib/rate/style'
    import 'vant/lib/toast/style'
    import 'vant/lib/uploader/style'
    import 'vant/lib/field/style'
    import 'vant/lib/button/style'
    import 'vant/lib/checkbox/style'
    import backNav from '../components/backNav.vue'
    import titleText from  '../components/title.vue'
    Vue.use(Image).use(ImagePreview).use(Rate).use(Toast).use(Uploader).use(Field).use(Button).use(Checkbox);
    export default{
           data(){
               return{
                   shopContent:{},
                   Order:0,
                   UserId:0,
                   UserName:'',
                   value:5, //星级
                   fileList: [], //图片,
                   textContent:'',
                   isAnonymous:false,//是否匿名评论
               }
           },
           mounted(){
              this.Order=this.$route.query.id;
              this.shopContent=this.$route.query.content;
              api.get('/user/getUserInfo').then(val=>{
                  this.UserId=val.id;
                  this.UserName=val.name;
              })
           },
        components:{
            backNav,
            titleText
        },
        methods:{
            ImagePreview(url){
                ImagePreview({
                    images:url,
                });
            },
            showStar(){
                this.isGood(this.value)
            },
            isGood(starNum){
                if(starNum<3){
                     Toast('差评')
                }
                if(starNum>=3&&starNum<5){
                    Toast('中评')
                }
                if(starNum==5){
                    Toast('好评')
                }
            },
            afterRead(file){

            },
            beforeRead(file) {
                return new Promise((resolve, reject) => {
                    if (file.type !== 'image/jpeg') {
                        Toast('请上传 jpg 格式图片');
                        reject();
                    } else {
                        resolve();
                    }
                });
            },
            commit(){
                const time=Date.now();
                if(this.textContent===''){
                    Toast.fail({message:'请填写评论'})
                }else {
                    const data={
                        pid:this.shopContent.pid,
                        sku:this.shopContent.sku_id,
                        Order:this.Order,
                        UserId:this.UserId,
                        UserName:this.UserName,
                        img:'',
                        start:this.value,
                        textContent:this.textContent,
                        isAnonymous:this.isAnonymous,
                        time:time
                    };
                    if(this.fileList.length>0){
                        const file=this.fileList[0].file;
                        let fileData = new FormData();
                        fileData.append("file", file, file.name);//很重要 data.append("file", file);不成功
                        myApi.post('/UploadFile',fileData,{
                            headers: { "content-type": "multipart/form-data" }}).then(val=>{
                            data.img=val.url;
                            myApi.post('/addComment',data).then(val=>{
                                Toast.success(val);
                                const that=this;
                                const timer=setTimeout(function () {
                                    that.$router.go(-1);
                                    clearTimeout(timer)
                                },500)
                            })
                        })
                    }else {

                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main{
        padding-top: 50px;
    }
    .imgBorder{
        border: 1px solid #e5e5e5;
    }
    .marginTop{
        margin-top: 15px;
    }
    .padding{
        padding: 15px 15px;
    }
    .bgWhite{
        background-color: white;
    }
    .padding-leftAndRight{
        padding-left: 15px;
        padding-right: 15px;
    }
    .row{
       display: flex;
        flex-direction: row;
    }
    .column{
        display: flex;
        flex-direction: column;
    }
    .justContentCenter{
        justify-content: center;
    }
    .alignCenter{
        align-items: center;
    }
    .flexEndRight{
        justify-content: flex-end;
    }
    .fontMarginLeft{
        margin-left: 5px;
    }
    .NormalFont{
        font-size: 14px;
    }
    .doubleBorder{
        border: 1px dashed #e5e5e5;
        height: 150px;
    }
    .bottomHeight{
        height: 46px;
    }
    .flexBetween{
        justify-content: space-between;
    }
</style>