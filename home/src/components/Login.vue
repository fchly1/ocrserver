<template>
  <div class="form">
    <div class="form-group">
      <label for="username">用户名：</label>
      <input type="text" class="form-control" id="username" name="username" v-model="username"/>
    </div>
    <div class="form-group">
      <label for="password">密码：</label>
      <input type="password" class="form-control" id="password" name="password" v-model="password"/>
    </div>
    <button type="button" class="btn btn-default btn-primary" @click='login()'>登陆</button>
    <router-link to="/registry" class="btn btn-default">注册</router-link>


  </div>

</template>

<script>
  import {userLogin} from './login.api';
  import Vueinfobox from './vue-infobox/vueinfobox';

  export default {
    name: "Login",
    components:{Vueinfobox},
    data: function () {
      return {
        username: '',
        password: '',
        user:this.$store.state.user
      }
    },
    methods: {
      login: function () {
        let username = this.username;
        let password = this.password;
        var that = this;
        userLogin(username, password, function (data) {
          //console.log(data);
          if(data.info == "success"){
            that.$store.commit('editLogin');
            that.$store.commit('updateUser',data.user);
            that.$store.commit('addInfoBox',{
              text:'登陆成功',
              type:'alert-success'
            });
            if(data.user.histories.length > 0){
              for (var i=0 ;i<data.user.histories.length;i++){
                that.$store.commit('addlocalHistory',data.user.histories[i]);
              }
            }
            that.$router.push('/');
          }
          //alert(data.info);
          // if(data.status){
          //   that.$store.commit('editLogin');
          //
          // }
        })
      }
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
