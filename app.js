var Express = require('express');
var app = Express();
var multer = require('multer');
var cors = require('cors');
var bodyParser = require('body-parser');
var gettoken = require('./apps/common/gettoker');
var imgbase64 = require('./apps/common/imgbase64');
var ocrfun = require('./apps/common/sendocr');
var moment = require('moment');
var config = require('./config/index');
var upload = multer({dest: 'public/uploads/images/'});
var expressSession = require('express-session');
var fs = require('fs');
var userRouter = require('./router/user');
var histroyRouter = require('./router/History');
var passport = require('./apps/auth/passport.config');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./config/model').User;
var Balance = require('./config/model').Balance;

var log = require('tracer').colorConsole({ level: 2})// 日志
var md5 = require('./apps/common/md5');
var uuid = require('node-uuid');
var fileinfo = require('fileinfo');
var filehash = require('./apps/common/filehash');

app.set('json spaces', 4);

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(cors());

app.use(Express.static(__dirname + "/public"));

app.use(expressSession({secret: 'pdfocr', cookie: {maxAge: 3600000}}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/', function (req, res) {

    res.sendfile('./html/index2.html');
})


app.post('/upload', upload.single('upimgfile'), function (req, res, next) {
    //console.log(req);
    //console.log(req.file);
    //计算文件md5hash
    filehash(req.file.path,function(hash){
        console.log(hash);
    });
    //判断文件否大于50M
    if (req.file.size > 52428800) {
        //删除临时文件
        fs.unlink(req.file.path);
        return res.json({
            status: '0',
            text: '文件太大了'
        })
    }

    // console.log(req.file.mimetype);
    // console.log(rex.test(req.file.mimetype));
    fileinfo(req.file.path).then(function(info){
        //console.log(info);
        //判断文件类型是否是图片或者pdf文件
        var rex = /pdf|jpeg|png|jpg/;
        if (!rex.test(info.mime)) {
            //删除临时文件
            fs.unlink(req.file.path);
            return res.json({
                status: '0',
                text: '文件类型不对'
            })
        }
        //获取文件扩展名
        var ext = info.extension;
        //生成随机文件名
        var filename = uuid.v1() + "." +  ext;
        var filepath = config.uploadPath  + filename ;
        fs.rename('./' + req.file.path, filepath, function (err) {
            if (!err) {
                // console.log(req.file.mimetype.indexOf('pdf'));
                if (req.file.mimetype.indexOf('pdf') > -1) {
                    return res.json({
                        file: config.host + config.showPath + filename
                    })
                }

                ocrfun.sendocr(filepath, function (text) {
                    if(req.isAuthenticated()){
                        Balance.findOne({where:{userId:req.user.id}}).then(function(data){
                            return data.decrement('balance', {by: 1})

                        }).then(function(data){
                            //data.reload();
                            console.log(data.balance);
                            if(data.balance < 0){
                                // return res.json({
                                //     info:'余额不足请充值',
                                //     text:'没余额了哦'
                                // })
                                console.log('余额不足请充值');
                                return false;
                            }
                        })
                    }

                    var result = '';
                    var words = text.words_result;
                    if (words) {
                        for (var i = 0; i < words.length; i++) {
                            result += words[i].words + ' \n ';
                        }
                    }
                    //console.log(req.user);
                    res.json({
                        file: config.host + config.showPath + filename ,
                        text: result,
                        time: new Date()
                    });
                });
            }else{
                res.send({ret_code: '0',info:'上传文件失败'})
            }
        })
        //res.send({ret_code: '0'});
    })



})

app.post('/urlocr', function (req, res, next) {
    //console.log(req.body);
    var imgurl = req.body.imgurl;
    ocrfun.sendocr(imgurl, function (text) {
        var result = '';
        var words = text.words_result;
        if (words) {
            for (var i = 0; i < words.length; i++) {
                result += words[i].words + ' \n ';
            };
        };

        res.json({
            file: imgurl,
            text: result,
            time: new Date()
        });
    });

})


app.post('/batchocr', function (req, res, next) {
    var imgs = req.body.imgs;
    var textarr = [];
    ocrfun.batchocr(0, imgs, textarr, function (data) {
        for (var i = 0; i < data.length; i++) {
            //console.log(data[i])
            var words = data[i].textAll.words_result;
            if (words) {
                for (var j = 0; j < words.length; j++) {
                    data[i].text += words[j].words + ' \n ';
                }
            }

        }

        res.json(data);
    })


})


app.use('/user', userRouter);

app.use('/history', histroyRouter);

app.listen(3000, function () {
    console.log('lister on 3000');
})