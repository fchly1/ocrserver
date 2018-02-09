import {host} from '../config/index'
import request from 'superagent'
import store from '../store/index'

export const userLogin = function(user,pass,cb){
  request.post('/user/login')
    .send({username:user,password:pass})
    .end(function(err,res){
      //console.log(res);
      if (res.ok) {
        cb(res.body);
      }else{
        cb({info:'用户名或密码不正确',status:false});
      }
    })
}


export const userLoginOut = function(cb){
  request.get(host + 'user/loginout')
    //.send({username:user,password:pass})
    .end(function(err,res){
      if (res.ok) {
        cb(res.body);
      }else{
        cb({info:'退出失败',status:false});
      }
    })
}
