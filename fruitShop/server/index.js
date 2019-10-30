/**
 * Created by sun77 on 2019/7/9.
 */
const express =require('express');
const app=express();
const path=require('path');
const bodyParser=require('body-parser');
const cors=require('cors')();
const history =require('connect-history-api-fallback');
require('./utils/connetMongodb');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors);
app.use('/GoodImg',express.static(__dirname+'/GoodImg'));
app.use('/Avatar',express.static(__dirname+'/Avatar'));
require('./routes/admin/index')(app);
require('./routes/user/index')(app);
app.use(history({
    verbose: true,
    index:'/index.html'
}));
app.listen(4004);