/**
 * Created by sun77 on 2019/7/22.
 */
const jwt = require('jsonwebtoken');
module.exports=(data,timeLimit,secret)=>{
    return  jwt.sign({
        data: data,
        exp: Math.floor(Date.now() / 1000)+timeLimit
    }, secret);
}