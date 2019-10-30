/**
 * Created by sun77 on 2019/9/20.
 */
class countTime{
    constructor(time){
        this.time=time;
        this.timeTransform=this.timeTransform.bind(this);
    }
    dateTransform(time){
        if(time==0){
            return `00:00`
        }
        const minutes=this.timeTransform(new Date(time).getMinutes());
        const seconds=this.timeTransform(new Date(time).getSeconds());
        return `${minutes}:${seconds}`
    }
    timeTransform(time){
        if(time<10){
            return `0${time}`
        }
        else {
            return `${time}`
        }
    }
}
export default new countTime();