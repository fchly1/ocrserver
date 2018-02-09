var request = require('superagent');
var gettoken = require('./gettoker');
var imgbase64 = require('./imgbase64')

var ocrfun = {};

ocrfun.sendocr = function (filepath,cb){
    var filebase64 = imgbase64(filepath,function(base){
        //console.log(base + '...');
        ocrfun.ocr(base,cb);
    });

}

ocrfun.ocr =function (base,cb){
    var baseurl = encodeURI(base);
    gettoken(function(token){
        var asscesstoken = token;
        var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?.(jpg|png|jpeg|bmp)/;
        if(reg.test(baseurl)){
            request
                .post('https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=' + asscesstoken )
                .set('Content-Type','application/x-www-form-urlencoded')
                .send({
                    'url':baseurl
                })
                .end(function(err,res){
                    console.log('...1');
                    cb(res.body);
                })
        }else{
            request
                .post('https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=' + asscesstoken)
                .set('Content-Type','application/x-www-form-urlencoded')
                .send({
                    'image':baseurl
                })

                .end(function(err,res){
                    console.log('...2');
                    //console.log(res.body);
                    var text = res.body;
                    cb(res.body);
                })
        };

    })

}

ocrfun.batchocr = function(num,images,textarr,cb){
    var totalNum = images.length;
    var img = images[num];
    ocrfun.ocr(img,function(data){

        if(num < totalNum){
            textarr.push({
                textAll:data,
                text:''
                //img:img
            });
            num++;
            ocrfun.batchocr(num,images,textarr,cb)
        }else{
            cb(textarr);
        }
    })
    //cb(img);
}

module.exports = ocrfun;