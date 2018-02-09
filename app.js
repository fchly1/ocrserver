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
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./config/model').User;
var log = require('tracer').colorConsole({ level: 2})// 日志
var md5 = require('./apps/common/md5');

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

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({where: {username: username}}).then(function (result) {
            //console.log(result);
            if (result != null) {
                if (result.password == md5(password)) {
                    return done(null, result);
                } else {
                    log.error('密码错误');
                    return done(null, false, { message: '密码错误' });

                }
            } else {
                log.error('用户不存在');
                return done(null, false, { message: '用户不存在' });
            }
        });
    }
));



// serializeUser 用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser(function(user, done) {
    done(null, user);
});
// deserializeUser 每次请求的时将从 session 中读取用户对象，并将其封装到 req.user
passport.deserializeUser(function(user, done) {
    return done(null, user);
});

app.get('/', function (req, res) {

    res.sendfile('./html/index2.html');
})


app.post('/upload', upload.single('upimgfile'), function (req, res, next) {
    //console.log(req);
    //console.log(req.file);
    //判断文件否大于50M
    if (req.file.size > 52428800) {
        //删除临时文件
        fs.unlink(req.file.path);
        return res.json({
            status: '0',
            text: '文件太大了'
        })
    }
    //判断文件类型是否是图片或者pdf文件
    var rex = /pdf|jpeg|png|jpg/;
    if (!rex.test(req.file.mimetype)) {
        //删除临时文件
        fs.unlink(req.file.path);
        return res.json({
            status: '0',
            text: '文件类型不对'
        })
    }
    // console.log(req.file.mimetype);
    // console.log(rex.test(req.file.mimetype));
    var filepath = './' + req.file.destination + req.file.originalname;
    fs.rename('./' + req.file.path, filepath, function (err) {
        if (!err) {
            // console.log(req.file.mimetype.indexOf('pdf'));
            if (req.file.mimetype.indexOf('pdf') > -1) {
                return res.json({
                    file: config.host + '/uploads/images/' + req.file.originalname
                })
            }

            ocrfun.sendocr(filepath, function (text) {
                var result = '';
                var words = text.words_result;
                if (words) {
                    for (var i = 0; i < words.length; i++) {
                        result += words[i].words + ' \n ';
                    }
                }
                res.json({
                    file: config.host + 'uploads/images/' + req.file.originalname,
                    text: result,
                    time: moment().format('YYYY-MM-DD HH:mm:ss')
                });
            });
        }
    })
    //res.send({ret_code: '0'});

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
            }
        }

        res.json({
            file: imgurl,
            text: result,
            time: moment().format('YYYY-MM-DD HH:mm:ss')
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