/**
 * Created by sun77 on 2019/5/22.
 */
import  Stroe from '../store/store'
let LoadingRequestCount=0;
function OpenLoading() {
    Stroe.commit('loading/sLoadingState', true)
}

function CloseLoading() {
    Stroe.commit('loading/sLoadingState', false)
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
