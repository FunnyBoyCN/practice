/**
 * Created by sun77 on 2019/7/22.
 */
const jwt = require('jsonwebtoken');
module.exports=(token,res,secret,loginCheck)=>{
    const userMs={};
    if(token){
        jwt.verify(token, secret,async function(err, decoded) {
            if(err){
                res.status(400).send({
                        message:'登录会话已过期,请先登录'
                })
            }else {
                if(!loginCheck){
                    userMs.userId=decoded.data.userId;
                    userMs.phone=decoded.data.phone;
                }else {
                    userMs.status=200;
                }

            }
        });

    }
    else {
        res.status(400).send({
            message:'请先登录'
        })
    }
    return userMs
} //使用用户接口的时候检查token是否过期或者存在