/**
 * Created by sun77 on 2019/7/22.
 */
const fs=require('fs')
module.exports=(url)=>{
    path='.'+url.substring(21);
    fs.unlink(path,(err)=>{
        if(err){
            return false
        }
    })
}