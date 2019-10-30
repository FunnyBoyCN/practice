/**
 * Created by sun77 on 2019/7/22.
 */
const multer=require('multer');
module.exports=(path,customName)=>{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+path)
        },
        filename: function (req, file, cb) {
            const name = file.originalname;
            const extension = name.substring(name.length - 4);
            cb(null, customName + '-' + Date.now()+extension)
        }
    });
    return multer({ storage: storage });
}