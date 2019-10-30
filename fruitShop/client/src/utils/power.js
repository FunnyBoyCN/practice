/**
 * Created by sun77 on 2019/10/19.
 */
class power{
    constructor(num){
        this._num=num;
    }
    shieldPhone(){
        return this._num.toString().substring(0,3)+'****'+this._num.toString().substring(7,11);
    }
    shieldCodeNum(){
        return this._num.toString().substring(0,4)+'**** **** **** *'
    }
    timeTrans(Num){
        let time=new Date(Num);
        let year=(time.getFullYear())<10?`0${(time.getFullYear())}`:(time.getFullYear());
        let month=(time.getMonth()+1)<10?`0${(time.getMonth())}`:(time.getMonth());
        let day=(time.getDate())<10?`0${(time.getDate())}`:(time.getDate());
        let hours=(time.getHours())<10?`0${(time.getHours())}`:(time.getHours());
        let minutes=(time.getMinutes())<10?`0${(time.getMinutes())}`:(time.getMinutes());
        let seconds=(time.getSeconds())<10?`0${(time.getSeconds())}`:(time.getSeconds());
        return  `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
}
export default power;