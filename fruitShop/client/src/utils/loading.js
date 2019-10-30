/**
 * Created by sun77 on 2019/10/10.
 */
/**
 * Created by sun77 on 2019/5/22.
 */
import {Toast} from 'vant'
let loading;
let LoadingRequestCount=0;
function OpenLoading() {
    loading=Toast.loading({
        mask: false,
        message: '加载中...'
    });
}
function CloseLoading() {
    loading.clear()
}
export default {
    showFullScreenLoading() {
        if (LoadingRequestCount === 0) {
            OpenLoading()
        }
        LoadingRequestCount++;
    },
    tryHideFullScreenLoading() {
        if (LoadingRequestCount <= 0) return ;
        LoadingRequestCount--;
        if (LoadingRequestCount === 0) {
            CloseLoading()
        }
    }
}
