<template>
  <div class="form">
    <div class="form-group">
      <label for="username">用户名：</label>
      <input type="text" class="form-control" id="username" name="username" v-model.lazy="username" data-rule = '^\w{4,16}$' @change = 'inputVerify($event)' data-toggle="tooltip" data-placement="right"  title="4到16个英文数字下划线"/>

    </div>
    <div class="form-group">
      <label for="nickname">昵称：</label>
      <input type="text" class="form-control" id="nickname" name="nickname" v-model.lazys="nickname" data-toggle="tooltip" data-placement="right"  title="中英文均可，最长14个英文或7个汉字" @change = 'inputVerify($event)' data-rule ="^\w{3,14}|[\u4e00-\u9fa5]{2,7}$"/>

    </div>
    <div class="form-group">
      <label for="password">密码：</label>
      <input type="password" class="form-control" id="password" name="password" v-model.lazys="password" data-rule="(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}" @change = 'inputVerify($event)'  data-toggle="tooltip" data-placement="right" title="最少6位，包括至少字母+数字"/>

    </div>
    <div class="form-group">
      <label for="password">重复密码：</label>
      <input type="password" class="form-control" id="compassword" name="compassword" v-model="compassword"/>
    </div>
    <button type="button" class="btn btn-default btn-primary" @click='registry()'>注册</button>
  </div>
</template>

<script>
  import {registryTo} from './registry.api';
  export default {
    name: "Registry",
    data: function () {
      return {
        username: '',
        password: '',
        compassword:'',
        nickname:'',
        isVerify:true,
        validate:{}
      }
    },
    methods:{
      registry:function() {
        for(var pop in this.validate){
          if(this.validate[pop] == false){
            this.isVerify = false;
          }
        }
        var that = this;
        if(this.isVerify){
          if (this.username == '' || this.password == '') {
            this.$store.commit('addInfoBox',{
              text:'用户名或密码不能为空',
              type:'alert-danger'
            });
            return false;
          }
          if (this.password !== this.compassword) {
            this.$store.commit('addInfoBox',{
              text:'密码不一致',
              type:'alert-danger'
            });
            return false;
          }



          var data = {
            username:this.username,
            password:this.password,
            nickname:this.nickname
          };
          registryTo(data,function(data){
            //console.log();
            that.$store.commit('addInfoBox',{
              text:data.info,
              type:'alert-info'
            });
          })

        }else{
          this.$store.commit('addInfoBox',{
            text:'较验未通过',
            type:'alert-danger'
          });
        }


      },
      inputVerify:function (ev) {
        var text = ev.target.value;
        var name = $(ev.target).attr('name');
        var rex = new RegExp($(ev.target).attr('data-rule'));
        if(rex.test(text)){
          $(ev.target).parent().addClass('has-success').removeClass('has-error');
          //this.isVerify = true;
          this.validate[name] = true;
        }else{
          $(ev.target).parent().addClass('has-error').removeClass('has-success');
          //this.isVerify = false;
          this.validate[name] = false;
        }

      }
    },
    mounted:function(){
      $("[data-toggle='tooltip']").tooltip();
    }
  }
</script>

<style scoped>
  .form {
    width: 30%;
    margin: 0px auto
  }

  label {
    float: left;
  }
</style>
