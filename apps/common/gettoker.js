var request = require('superagent');
var config = require('../../config/index');
var HOST = 'https://aip.baidubce.com';
var path = '/oauth/2.0/token';
var model = require('../../config/model');
var Token = model.Token;

function getAssionToken(cb) {
    request
        .get('https://aip.baidubce.com/oauth/2.0/token')
        .query({
            'grant_type': 'client_credentials',
            'client_id': config.bdapikey,
            'client_secret': config.bdsecretkey
        })
        .end(function(err,res){
            //console.log(res);
            if(res.ok){
                token = res.body.access_token;
                Token.update({'accesstoken':token},{'where':{'name':'bdtoken'}}).then(function(info){
                    console.log(info);
                })
               cb(token);
            }

        })
}


module.exports = function(cb){
    var tokens = {};
    Token.findOrCreate({where:{name:'bdtoken'},default:{name:'bdtoken'}}).then(function(token){
        tokens = token;

        var dataToken = tokens[0].accesstoken;
        var currDate = new Date().getTime();
        var update = tokens[0].updatedAt.getTime();
        //token大于30天就会失效
        if((currDate-update) > 2592000000){
            getAssionToken(function (newtoken) {
                cb(newtoken);
            });

        }else{
            //判断数据库中token是否存在
            if(dataToken){
                cb(dataToken);
            }else{
                getAssionToken(function (newtoken) {
                    //console.log(newtoken+'.....');
                    cb(newtoken);
                });
            }
        }

    })
}