var express = require('express');
var router = express.Router();
var model = require('../config/model');
var User = model.User;
var md5 = require('../apps/common/md5');
var copyobj = require('../apps/common/utils');
var passport = require('passport');
/**
 * 用户查询通过
 */

router.get('/get/:id',function (req,res,next) {
    var id = req.params.id;
    User.findOne({where:{id:id},include:[{model: model.Order},{model: model.History}] }).then(function(data){

        if(!data){
            res.json({
                info:'用户不存在'
            });
        }else{
            res.json({
                info:'查询成功',
                data:data
            });
        }

    })


})






// 登录认证

router.post('/login', passport.authenticate('local'),function(req, res) {

        var id = req.user.id;
        User.findOne({where:{id:id},include:[{model: model.Order},{model: model.History}] }).then(function(data){

            if(!data){
                res.json({
                    info:'用户不存在'
                });
            }else{
                var user = {
                    id:data.id,
                    username:data.username,
                    nickname:data.nickname,
                    avatar:data.avatar,
                    histories:data.histories,
                    orders:data.orders
                };

                res.json({
                    info:'success',
                    user:user
                });
            }

        })


    //res.json({info:"success",user:user});

});


//登出
router.get('/loginout',function(req, res) {
    //console.log(req.user);
    req.logout();
        //console.log(req);
        res.json({info:"登出成功"});

});

//是否登陆
router.get('/islogin',function(req, res) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        var id = req.user.id;
        User.findOne({where:{id:id},include:[{model: model.Order},{model: model.History}] }).then(function(data){

            if(!data){
                res.json({
                    info:'用户不存在'
                });
            }else{
                var user = {
                    id:data.id,
                    username:data.username,
                    nickname:data.nickname,
                    avatar:data.avatar,
                    histories:data.histories,
                    orders:data.orders
                };

                res.json({
                    info:'success',
                    user:user
                });
            }

        })

    }


});



/**
 * 用户添加
 */
router.post('/add',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    var userdata = req.body;
    userdata.password = md5(userdata.password);
    User.findOne({where:{username:username}}).then(function(data){
        //console.log(data);
        if(!data){
            User.create(userdata).then(function(data){
                if(!data){
                    return '创建失败';
                }
                res.json({
                    info:'注册成功',
                    data:data
                });
            })
        }else{
            res.json({
                info:'用户已经存在'
            });
        }

    })
})




/**
 * 用户删除
 */

// router.get('/del/:id',passport.authenticateMiddleware(),function(req,res,next){
//   var id = req.params.id;
//     User.findOne({where:{id:id}}).then(function(data){
//         //console.log(data);
//         if(!data){
//             res.json({
//                 info:'用户不存在'
//             });
//         }else{
//             User.destroy({where:{id:id}}).then(function(data){
//                 if(!data){
//                     return '删除失败';
//                 }
//                 res.json({
//                     info:'删除成功',
//                     data:data
//                 });
//             })
//         }
//
//     })
//
// })


/**
 * 用户编辑
 */

router.post('/update',function (req,res,next) {
    var id = req.body.id;
    var reqdata = req.body;

    User.findOne({where:{id:id}}).then(function(data){
        //console.log(data);
        if(!data){
            res.json({
                info:'用户不存在'
            });
        }else{
            User.update(reqdata,{where:{id:id}}).then(function(data){
                if(!data){
                    return '修改失败';
                }
                res.json({
                    info:'修改成功',
                    data:data
                });
            })
        }

    })
})

module.exports = router;