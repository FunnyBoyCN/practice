/**
 * Created by sun77 on 2019/7/15.
 */
module.exports=(time)=>{
    let date = new Date(time);
    let Month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    let Day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    // let Hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    // let Minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    // let Seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${date.getFullYear()}-${Month}-${Day}`;
}
