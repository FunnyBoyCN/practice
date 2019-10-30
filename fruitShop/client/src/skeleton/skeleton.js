/**
 * Created by sun77 on 2019/8/25.
 */
import  Vue from 'vue'
import skeletonHome from './views/skeletonHome.vue'
export default new Vue({
    components: {
        skeletonHome,
    },
    template: `
        <div>
            <skeletonHome id="skeleton-home" style="display:none"/>
        </div>
    `
})