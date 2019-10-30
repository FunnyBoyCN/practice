<template>
    <div>
        <div class="loginArea" @click="isOpenLogin=true" v-if="!isLogin">
            <van-icon name="user-circle-o" size="3rem" color="whitesmoke" class="loginAvatar"/>
            <div>登录/注册</div>
        </div>
        <div class="loginArea" v-if="isLogin">
            <div class="avatar" >{{user.name.slice(0,3)}}</div>
                <van-button
                        @click="logout"
                        class="logout margin-left"
                        plain hairline
                        type="danger"
                >退出登录
                </van-button>
        </div>
        <div class="orderArea">
            <div class="myOrder border-bottom" @click="goOrder">
                <div class="LeftTitle">我的订单</div>
                <div class="RightTitle">全部订单<van-icon name="arrow" size="1.5rem" color="#b1b1b1"/></div>
            </div>
            <div class="OrderList">
                  <div class="OrderListItem"  @click="toChildOrder(0)">
                      <van-icon name="pending-payment" size="1.5rem" color="#b1b1b1" :info="allPayNum.length"/>
                      <div>全部订单</div>
                  </div>
                <div class="OrderListItem"  @click="toChildOrder(1)">
                    <van-icon name="logistics" size="1.5rem" color="#b1b1b1" :info="notPayNum.length"/>
                    <div>未付款</div>
                </div>
                <div class="OrderListItem"  @click="toChildOrder(2)">
                    <van-icon name="replay" size="1.5rem" color="#b1b1b1" :info="payNum.length"/>
                    <div>已付款</div>
                </div>
            </div>
        </div>
        <div class="operationList" v-for="(val,index) in operationList" >
            <div class="operationItem" v-for="(v,k) in val" >
                <img class="operationImg" :src="v.img">
                <div class="operationContent">
                    <div class="operationText">{{v.text}}</div>
                    <van-icon name="arrow" size="1.5rem" color="#7a7a7a"/>
                </div>
            </div>
        </div>
        <div class="operationItemNormal margin-top bg-white padding" v-for="(v,k) in otherOperationList" >
            <img class="operationImg" :src="v.img">
            <div class="operationContent">
                <div class="operationText">{{v.text}}</div>
                <van-icon name="arrow" size="1.5rem" color="#7a7a7a"/>
            </div>
        </div>
        <transition enterActiveClass="zoomIn" leaveActiveClass="zoomOut" appear>
        <div class="login animated faster" v-if="isOpenLogin">
            <van-icon name="close" class="closeIcon" size="1.5rem" @click="isOpenLogin=false" color="white"/>
            <div class="loginTitle">
                <div>请使用账户登录/注册</div>
            </div>
            <div class="loginInput">
                    <div class="loginTag">
                        <div class="tagItem" @click="isLoginType=true" :class="{active:isLoginType}">登录</div>
                        <div class="tagItem " @click="isLoginType=false" :class="{active:!isLoginType}">注册</div>
                    </div>
                    <div class="inputItem border-bottom">
                        <van-icon name="contact" size="1.5rem" color="#ff6700"></van-icon>
                        <input  type="text"
                                placeholder="请输入用户名"
                                class="margin-left"
                                v-model="form.username"
                                v-validate="'required'"
                                name="name"
                                data-vv-as="用户名"
                                :class="{errBorder:errors.has('name')}"
                        />
                        <span class="error">{{ errors.first('name') }}</span>
                    </div>
                    <div class="inputItem border-bottom marginMax-top">
                    <van-icon name="lock" size="1.5rem" color="#ff6700"></van-icon>
                    <input
                            :type="type"
                            placeholder="请输入密码"
                            class="margin-left"
                            autocomplete="off"
                            name="password"
                            v-model="form.password"
                            v-validate="'required'"
                            data-vv-as="密码"
                            :class="{'is-danger': errors.has('password')}"
                            ref="password"
                    />
                    <span class="error">{{ errors.first('password') }}</span>
                    <van-icon :name="eyesIcon" size="1.5rem" color="#ff6700" @click="openEyes=!openEyes"></van-icon>
                   </div>
                    <transition leaveActiveClass="slideOutRight" enterActiveClass="slideInRight" appear>
                    <div  class="inputItem border-bottom marginMax-top animated faster" v-if="!isLoginType">
                    <van-icon name="replay" size="1.5rem" color="#ff6700"></van-icon>
                    <input
                            :type="type"
                            placeholder="请确认密码"
                            class="margin-left"
                            autocomplete="off"
                            v-validate="'required|confirmed:password'"
                            data-vv-as="确认密码"
                            data-vv-name="repassword"
                            :class="{'is-danger' :errors.has('repassword') }"
                            v-model="form.repassword"
                    />
                   <span v-show="errors.has('repassword')" class="error">{{ errors.first('repassword') }}</span>
                    </div>
                    </transition>
                    <van-button
                            class="confirmBtn"
                            v-if="isLoginType"
                            :disabled="(errors.has('password')||errors.has('name'))?true:false"
                            @click="loginBtn(true)"
                    >登录
                    </van-button>
                    <van-button
                            class="confirmBtn"
                            v-if="!isLoginType"
                            :disabled="(errors.has('password')||errors.has('name')||errors.has('repassword'))?true:false"
                            @click="loginBtn(false)"
                    >注册
                    </van-button>
            </div>
        </div>
        </transition>
    </div>
</template>
<script>
import {Icon,Tab, Tabs,Button,Toast,Dialog} from 'vant'
import  Vue from 'vue'
import {mapState} from 'vuex'
import {myApi} from '../utils/myApi'
import 'vant/lib/icon/style'
import 'vant/lib/tab/style'
import 'vant/lib/tabs/style'
import 'vant/lib/button/style'
import 'vant/lib/toast/style'
import 'vant/lib/dialog/style'
Vue.use(Icon).use(Tab).use(Tabs).use(Button).use(Toast)
export default{
    created(){
        this.$store.commit('render/IsHome',true)
        const isOpen=Boolean(this.$route.params.isOpenModal);
        this.isOpenLogin=isOpen;
    },
    mounted(){
        if(this.isLogin){
            this.$store.dispatch('userMs/getOrderNum',this.userId)
        }
    },
    data(){
        return {
            isOpenLogin: false,
            orderList: [{
                IconName: 'pending-payment',
                text: '全部订单',
                info:'',
            },
                {
                    IconName: 'logistics',
                    text: '未付款',
                    info:'',
                },
                {
                    IconName: 'replay',
                    text: '已付款',
                    info:'',
                }],
            operationList: [[
                {
                    img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAEqklEQVR4nO2aTYhWVRjHf6PJNItEEAKZnSEVZCtrNN1oM9mMizKhVdOiXEpbk0CnFuEyCdpGbSYIrc2oTRMhxBRUtJjIeYmWWcxCtIRw8WaL5xw7c9/7nq/7cc4L9wcvjOeej+f5ez6e89wLHR0dHR3ZMgbQ/3pvajv2AOeBafXvFeBN4NdkFgFbD6/xQEoDFI8C3wE7jLKXgCPAfqCXwijNlpSDK95lsziaHepZUnIQaNry7LnWrBhCDgJlTQ4CrVieLbdmxRByEOgt4FZJ+S31LCk5CLSOnFaXgHvqd0mVrSe0C8hDIJCj/D0kLhsDLpD4eNfkIhDAgvH3uVRGFMlFoENIYKg5osqSk4tAZTNmoW0jyshBoEOUB4vPksEsykGgs5HPWiG1QM8AM5bnM8DBlmwpxRRoD3ARuK1+F1VZk/icVk3PIqvfOh9UlnIAiWabSjkcAFY96x4MqBuC1e+th9d6egalSDmExDpNzSKn31qgtlMO+4GjAfWPqjZ14/Q71SYdMyOSnGhaoDZTDlPAbES7WdW2Tpx+a4HaTDlUmQl1zyKn31ogM+Xwt/r9BYwDx6G25P7TwFyF9nOqjzrYhvg2jviq/d6UajH3oB5wAtiufh8AE8hu/iP1TO86ZkAdfUwBPyC+TSC+ar9PYIQ1tk16yfj7SSQOeV91EsNTwLHItibHgH2RbbcjPqwiPmmWyqvbBfoWuFmoewr4BXghwrg6czwLEW1eRGw/xWa/byK+lmITqA9cLSmfBD5H1uqkp3H7qLb3FJnDfxZNIrZ+Rrm9VxFfS3HFQUOnHrLBlf2PlHEOda2piTHce5E5449b6tl8dDpmVZf/1/Q3wLAX/A8DzzvGiWFW9V3GXvz2zGGr5D4ugazr0+AActLpU8FkA3gVu9Ch9FWfG4Xy0FO3uM8O4HPVsCpssA04A6wxeMdZBOapR6S+6muxUD6txj6jbPHhsquCj0BXPAfTPIKE6R8Bu4zyOkQqE2eXGutLNXYIX7gq+Aj0E3AjcOAxZAn0gDeMcaqIVBRni+q7p8YK5QbimxUfge7hMRWH8BDyEtAMzGJEKoqjA9cLaowYLiO+WfFNd1iPQg+mkI3zPLKRLgKv4CeSKc6E6qOOq4+XT74CrQB3420B5MJ7GvgZScZ/glskU5wZ1fY01S/Pd7GnOu7jK9Ad4Fq0OZvZjWziHwNfMVwkLc6Kqrus2tbBNcQnJyEZxarLrMg8cB14kME9Scc546rOfM1je/uSUiCAncCHwEngbUSYPvAO8Jp6trOBcb19Cf0M+DrwWIRBPvwD/KZs2s1gRF4X68DjPhVjPgNeojmBJoAnGurbJGglhL7VaGKZtU3QzSBUoFU8d/9MuYNkHrwJFcg7fsiU4Hgu5sXhKC+zYNtjBPK6w2RI1J0yRiCvW3CGxGQlot/Nj+Iyi7K5E8hBrEDfM5gPzpkNxOZgYgX6l/BUbEquIDYHU+X7oFFaZtG2Vkk8LQOfVmjfJtHBbRWBbgMvV2g/EqT+Tjp7OoEcVE1+j8qVI/rDiW4GOegEctAJ5KCqQH/UYkWz/FmlcVWBTlY1oGF+B15PbURHR0dHR0P8B16Z/23Ljv1mAAAAAElFTkSuQmCC',
                    text:'会员中心'
                },
                {
                    img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNTE4RjhBQjhFQkIxMUU2OTc2RThDNTRCNDk3OEY5NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNTE4RjhBQzhFQkIxMUU2OTc2RThDNTRCNDk3OEY5NCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE1MThGOEE5OEVCQjExRTY5NzZFOEM1NEI0OTc4Rjk0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE1MThGOEFBOEVCQjExRTY5NzZFOEM1NEI0OTc4Rjk0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vRshyQAAAudJREFUeNrsml2IDWEYx+ewHOvOzbpQa11QLtSmdbFZcrHrSinXSi6Eko+Udgu5WLW+LiSuKFxIKZIL+YgLZRftBfkqpZRISau2XSvb8X/Mc+rxmjkz2rFm5v0/9at3Zs6ZOfM77/N+zVRqtVrAiI8ZVEBBFERBFERBFERBnkZTvbDh7jvaMHG1eyFr0FRSrAPcBmOgVnLG9F47GqaYiRXgAah6UkmaQQ9YrTxOqkFHPZJjQ+75SJoU6/S4yelMI6jqsaAqx0EcKFIQBVEQBZVwslqwGAU3wH3wCnzUaYP3gj6Dw+CsSmINMnEFbANfmGJ/xgHQH7F/nk4w20ALmJnBtXqLJqgPDDj7lqm09WB2xtcrlKDrzgxbet1DKq3J9xQbAVtN71QBF8BGjoPCOAE+me3+6ZaTZ0HfwRmzvdxtG3wXdMvpzgdifquk4R7QGoRLp+06Rsps0JjXNuieKcvzl+6Iz4jAleC12fcUbAFDKqq0NeiZKa/RBtqN/Y4cG+eC8ElFaQW9N+XWmM9cSjjH5TIL+mbK8yOOy7Osrwnn+FBmQXOdtibqeEvCOdrKLMimVVw7s6nB9ysJxwsvqN2UZc1nMuIzMuXoivn+wSCj53t5FdRjyrIYdi0mze6AYypjMVgHbqq8TKJSf0/avP6ShxenJzXN6g2t3PwLMGsarv1rSJH3119kXWeX2X6jI2ZONUzsBIvM9mlNJwrSmAPOB7+vEu7T3mmUgsKQ5dRTzr6LYAk4GYSL+P80irDkul3/yB3gh+nZdoO9OiSQFnWBM8D0RpCErCwuBZvBW6e3G1a8TDE33Z6D4w0msIGvNagezZpW0uU/DMJ1o5faFo1kdI3hIguyNb+rwVRjygPFIqbYf/snGBREQRREQRRUHkETHvuYSCNo0GNBg2kE9Xpai+Se+9IIegRWBeGC+LgHYsb1XuWeh9JOVp+AtWyizVMNBrt5CqIgCqIgCqIgCmJQ0F/ETwEGAHbgsxy9Nu+hAAAAAElFTkSuQmCC',
                    text:'我的优惠'
                }
            ],[
                {
                    img:'data:image/png;base64,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',
                    text:'服务中心'
                },
                {
                    img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODIyQUM5MEYyMEIxODZDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyRDEwRURERUIwOTYxMUU2OTQxN0U3MTQ5QURFODU1RSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyRDEwRUREREIwOTYxMUU2OTQxN0U3MTQ5QURFODU1RSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NmNjMjQyY2EtZDQwZS00YmMxLWE2ZWYtMDVkNDk3N2I5YjUwIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWFmZTU3OTItZDcyNS0xMTc5LWExYTktYTI2YTg0MzgzYTZiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+f8uDAQAAA7tJREFUeNrsnFtIFFEYx/+7mlp4y9UuppubmHbB1PASUpBoQQo+9CAagg8SFCoVi/SSaS9BlEWWPRQlRfTSRUMJddGkh8TKS2heAsVl1TLzll2W1G1mvNSuu+6MKDkz3wcDszvnf858v/3OOd85M6zCZDKBzLYpCBABIkAEiAARIAIkD0CX482vanWW5bMk4PMNIYUdeZcc/1KAysIcGJo8MTUpPiwOjKt+4aM4fMYH7j7n+cqUPMtlcXB634gTDmvsfbP3/+LSKSE9Qcm7ATZypGCGFnchxZWCfgEpmGkaKwNIpkaAlm0W0+qyCdAy5Q7yAGSeJGZI1P+SpQGyhNNYdhQ1RUmSQhOXXY6IZLuQlHbh9DZFoPZmkuRi52VxEvQtYfZ6x2KL1QwM9Wjw6HQejBPS7GDOrkDq1Qvw1vTYiiTb0/yPMQ88zZMuHNZY30oL8jhfBeVBv43H8SzvIsYHpD9NjRrA+cr6zA+QKQOVV85ioG2tbOZy1teqa7mc73YAZeBVSSY6ajSyS3jaqwM53y0G7YUR9O5xrGzXFY1PYu13MRd32fKBsxuPMchhjYyXpiYegCYG5cvn+zCfCHJaegNO62aSL7HqHZ15APLaalxyA6xWFfBTtHpVgNEeoBJsi6pfcgMBe99CHdYoWr0mssFyybEwgkKPlFsLNV7huSeplDtEq098br+LuaqGEJVWJ7iBmHQd3LyHuIM9F5s++lgt57slNytFS7AvDRjqDkRXnR+vyoMOGBCT8nA+PGNSgMGPIeLSp963tqJ3yM/Pt7IJomjG9v1jmJragP5Wf9ubJUwARqe+RkJOIXN+758LM/ppVt/mby2/WB16BRCZ0sDplQ53he4HzazNvurVaK1KRHd9FLfyVTKJpMdmQB3eyPTZMqjU+nnyI33MvTD1efmZ61sqkqFvisDY7O7AatBrohqw+1CFmd4uIPblBa3OOijrNldxFvrbg1F9/ST3KSGnGL47OvF3s3+168Ef0JxpeY1zWfj1zRW6ohPoqFGbXQmJ0yM++xZc3CZg+6nI/9ZDGCDblsmEahA8fQcwPemIsU8b0de2E/rmUHTWLj4QBh80MLnJe2zZ9QEemz5z360GvXdAF3N2e7kAsdElrTettDoFn2L06JkAESACtCJm+T4mAaIIIkAEiAARIAJEgMgIEAEiQASIABEgAkSAyAQCGpaQ38MrAeiBhADd4VvQUUCluczBPipJZ471IgUzMvtDn+MroD8WIEAEiAARIAJEgAiQXO2PAAMABmvamAQ2Ng8AAAAASUVORK5CYII=',
                    text:'小米之家'
                }
            ]],
            otherOperationList:[{
                img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAABPUlEQVR4Ae3ctVUAURBGYc5mWA/UgNMFVdAKIe7uEL8mcLcacMuHH0uQPWcFe3ODW8B861phZikRCAD9fSCAAApJsxpSx+pO2T/t7nWGEdVWHCgk1WpBWaQtq9pcQK84m8oib+cNKSvQvDInrWQDCkmjMme1ZQHqdwg0kgVo3yHQaRagc4dAD1mAbhwCGUAAFQkggAACCKC6kuuIC6jsG1ohaXcNBJAGLFhn7EBWZgABBBBAAAEEEEAAcSYdfADlLSTdCiCA8t8HmmQn/RsBBBBAAAEEEEAAAQQQQAABxNsdAP2HAAIIIIAAAggggPgc6p4P6tI7zgLU6xBoOAtQg0Og1qyfhU87wlnK8918lVpzgLOlatKB0pFmIsZZeMPJDvRxn9Sn9tW5uvmnXahDNaCa+D0O/w8CCCCA/nmPOt4V6XqGZ9oAAAAASUVORK5CYII=',
                text:'F码通道'
            },{
                img:'https://m.mi.com/static/img/i-setting.fb9625b3f2.png',
                text:'设置'
            }],
            openEyes:false,
            isLoginType:true,
            form:{
                username:'',
                password:'',
                repassword:'',
                ifPid:false,
            },
        }
    },
    methods:{
        logintranslate(index, title){

        },
        goOrder(){
            if(this.isLogin){
                this.$router.push('/myOrder')
            }else {
                Dialog.confirm({
                    message: '您尚未登录,\n是否登录查看',
                    confirmButtonText:'是',
                    confirmButtonColor:'#ff6700'
                }).then(() => {
                    this.isOpenLogin=true;
                }).catch(() => {

                })
            }

        },
        toChildOrder(index){
            if(this.isLogin){
                this.$router.push({path:'/myOrder',query:{index:index}})
            }else {
                Dialog.confirm({
                    message: '您尚未登录,\n是否登录查看',
                    confirmButtonText:'是',
                    confirmButtonColor:'#ff6700'
                }).then(() => {
                    this.isOpenLogin=true;
                }).catch(() => {

                })
            }

        },
        loginBtn(flag){
                const myform={
                    name:'',
                    password:""
                };
                myform.name=this.form.username;
                myform.password=this.form.password;
                if(flag){
                    this.$store.dispatch("userMs/login",myform).then((res)=>{
                        Toast.success('登录成功');
                        this.$store.dispatch("userMs/getShopCart");
                        this.isOpenLogin=false;
                    });
                }else {
                    this.$store.dispatch("userMs/register",myform).then(()=>{
                        Toast.success('注册成功');
                        this.$store.dispatch("userMs/getShopCart");
                        this.isOpenLogin=false;
                    });
                }
                if(this.$route.params.ToPid!==undefined){
                    const pid=+this.$route.params.ToPid;
                    let toast;
                    Toast.success({
                        duration: 800,
                        message: '登录成功'
                    });
                    const that=this;
                    const timer1=setTimeout(()=>{
                        toast=Toast.loading({
                            duration: 0,       // 持续展示 toast
                            forbidClick: true, // 禁用背景点击
                            loadingType: 'spinner',
                            message: '正在跳转'
                        });
                        clearTimeout(timer1);
                        that.$router.push({path:'/shopDetail',query:{pid:pid}})
                        toast.clear();
                    },800);
                }
        },
        logout(){
            this.$store.dispatch("userMs/logout");
           Toast.success('已退出登录')
        },
    },
    computed:{
        type(){
            if(this.openEyes){
                return 'text'
            }else {
               return 'password'
            }
        },
        eyesIcon(){
            if(this.openEyes){
                return 'eye-o'
            }else {
                return 'closed-eye'
            }
        },
        ...mapState("userMs",["isLogin","user",'userId','notPayNum','allPayNum','payNum']),
    },
    watch:{

    }
}
</script>
<style lang="scss" scoped>
.loginArea{
    height:84px;
    background: url("https://m.mi.com/static/img/bg.63c8e19851.png") center 0 #f37d0f;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 20px;
    .loginAvatar{
        border-radius: 50%;
        background-color: #fe9f00;
    }
    .avatar{
        width: 50px;
        height: 50px;
        border: 1PX solid gainsboro;
        border-radius: 5px;
        text-align: center;
        font-size: 16px;
        line-height: 50px;
        color: white;
    }
    .logout{
        border-radius: 5px;
        background: transparent;
        color: white;
        border-color: white;
    }
    div{
        font-size: 14px;
        color: white;
        margin-left: 10px;
    }
}
    .orderArea{
        display: flex;
        flex-direction: column;
        .myOrder{
            display: flex;
            flex-direction: row;
            justify-content:space-between;
            align-items: center;
            height: 42px;
            font-size: 14px;
            padding: 0 15px;
            background-color: white;
            .RightTitle{
                display: flex;
                flex-direction: row;
                align-items: center;
            }
        }
        .OrderList{
            padding: 0 35px;
            height: 88px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            background-color: white;
            .OrderListItem{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                div{
                    margin: 5px 0;
                    font-size: 14px;
                }
            }
        }
    }
    .operationList{
        margin-top: 15px;
        padding: 0 15px;
        display: flex;
        flex-direction: column;
        background-color: white;
        .operationItem{
            position: relative;
              display: flex;
              flex-direction: row;
             justify-content: space-between;
            align-items: center;
            height: 54px;
            .operationImg{
                width: 25px;
                height: 25px;
            }
            .operationContent{
                width: 80%;
                display: flex;
                height: 100%;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
            }
        }
        .operationItem:last-child:after{
            width: 0;
        }
    }
.operationItemNormal{
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 54px;
    .operationImg{
        width: 25px;
        height: 25px;
    }
    .operationContent{
        width: 80%;
        display: flex;
        height: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
}
.operationItem:last-child:after{
    width: 0;
}
.login{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: gainsboro;
    .closeIcon{
        position: fixed;
        top: 15px;
        right: 15px
    }
    .loginTitle{
        width: 100%;
        height: 200px;
        background-color: #ff6700;
        text-align: center;
        font-size: 16px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .loginInput{
        width: 300px;
        height: 450px;
        background-color: white;
        position: absolute;
        top:150px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        padding: 0 20px;
        justify-content: center;
        align-items: center;
        .loginTag{
            width: 80%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border: 1PX solid #ff6700;
            background-color: white;
            height: 35px;
            margin-bottom: 55px;
            border-radius: 5px;
            font-size: 16px;
            .tagItem{
                width: 50%;
                height: 100%;
                line-height: 35px;
                text-align: center;
                color: black;
                border-right:1PX solid #ff6700 ;
            }
            .tagItem:last-child{
                border: 0;
            }
            .active{
                background-color: #ff6700;
                color: white;
            }
        }
       .inputItem{
           display: flex;
           align-items: center;
           height: 35px;
           width: 90%;
           position: relative;
           input{
               outline: none;
               font-size: 16px;
               border: 0;
           }
           span{
              position: absolute;
               bottom: -20px;
               left: 35px;

           }
       }
        .confirmBtn{
            text-align: center;
            height: 35px;
            width: 80%;
            font-size: 16px;
            color: white;
            background-color: #ff6700;
            border-radius: 15px;
            line-height:35px ;
            margin-top: 45px;
        }
    }
}
    .operationItem:after{
        position: absolute;
        content: '';
        bottom: 0;
        height: 1PX;
        width: 290px;
        right: -15px;
        background-color: #e5e5e5;
    }
    .border-bottom{
        border-bottom: 1PX solid #e5e5e5;
    }
    .margin-top{
        margin-top: 15px;
    }
    .marginMax-top{
        margin-top: 35px;
    }
    .bg-white{
        background-color: white;
    }
    .padding{
        padding: 0 15px;
    }
    .margin-left{
        margin-left: 15px;
    }
.error{
    color: red;
}
</style>