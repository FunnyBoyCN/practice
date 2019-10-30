/**
 * Created by sun77 on 2019/8/22.
 */
export  default(timeArray)=>{
    const reg=new RegExp(/\,/g);
    let newTimeLimit=[];
    for (let i=0;i<timeArray.length;i++){
        let item=timeArray[i].split('-');
        item[0]+='年';
        item[1]+='月';
        item[2]+='日';
        item=item.toString().replace(reg,'');
        newTimeLimit.push(item)
    }
   return  `${newTimeLimit[0]}至${newTimeLimit[1].split('年')[1]}`;

}