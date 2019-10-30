/**
 * Created by sun77 on 2019/7/22.
 */
class ImageController{
    save(path,customName){
        const multer=this.getmulter();
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
    };
    deletedImage(url){
        const fs=this.getFs();
        const path='.'+url.substring(23);
        fs.unlink(path,(err)=>{
            if(err){
                return false
            }
        })
    }
    getmulter(){
        return require('multer');
    }
    getFs(){
        return require('fs');
    }
}
module.exports= new ImageController();