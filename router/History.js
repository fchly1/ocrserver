var express = require('express');
var router = express.Router();
var model = require('../config/model');
var History = model.History;
var md5 = require('../apps/common/md5');
var passport = require('../apps/auth/passport.config');

router.get('/get/:id',function(req,res,next){
    var id = req.params.id;
    History.findOne({where:{id:id} }).then(function(data){

        if(!data){
            res.json({
                info:'数据不存在'
            });
        }else{
            res.json({
                info:'查询成功',
                data:data
            });
        }

    })
})

/**
 * 数据添加
 */
router.post('/add',passport.authenticateMiddleware(),function(req,res,next){
    var file = req.body.file;
    var text = req.body.text;
    var historydata = req.body;
    historydata.userId = req.user.id;
    History.findOne({where:{text:text}}).then(function(data){
        //console.log(data);
        if(!data){

            History.create(historydata).then(function(data){
                var result = {};
                if(!data){
                    return '创建失败';
                }
                result.info = '保存成功';
                result.data = data;
                model.Order.create({
                    orderPrice:1,
                    userId:data.userId,
                    historyId:data.id
                }).then(function(data){
                    if(!data){
                        //return '扣款失败';
                        result.orderinfo = '扣款失败';
                        res.json(result);
                    }
                    res.json(result);
                })


            })
        }else{
            res.json({
                info:'文件已经存在'
            });
        }

    })
})



module.exports = router;