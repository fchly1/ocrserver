import {host} from '../config/index'
import request from 'superagent'


export const registryTo = function(data,cb){
  request.post(host + 'user/add')
    .send(data)
    .end(function(err,res){
      if (res.ok) {
        cb(res.body);
      }else{
        cb({info:'注册失败!',status:false});
      }
    })
}
