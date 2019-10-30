/**
 * Created by sun77 on 2019/5/27.
 */

const scrollTop={
    mountedScroll() {

    },
    removeScroll() {
        window.removeEventListener('scroll',this.scroll);
    },
   scroll:function () {
        let TOP=window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop;
        let TotalHeight=document.body.scrollHeight;
        let showNum=TOP/TotalHeight;
        if(showNum>0.4){
            return true
        }else if(showNum<0.4){
            return false
        }
    }
}

export   {scrollTop}
