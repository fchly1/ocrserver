<template>
    <div class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <router-link to="/" class="navbar-brand">PdfOcr</router-link>
        </div>
        <ul class="nav navbar-nav navbar-right" v-if="isLogin == false">
          <li >
            <router-link to="/login" >登陆</router-link>
          </li>
          <li>
            <router-link to="/registry" >注册</router-link>
          </li>
          <li>
            <router-link to="/histories">历史记录</router-link>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right" v-if="isLogin">
          <li >
            <a href="javascript:void(0)">欢迎你回来，{{getUser.nickname ? getUser.nickname : getUser.username}}</a>
          </li>
          <li >
            <a href="javascript:void(0)" @click = "logout">退出</a>
          </li>
          <li>
            <router-link to="/histories">历史记录</router-link>
          </li>
        </ul>
      </div>

    </div>
</template>

<script>
    import {userLoginOut} from "./login.api";

    export default {
        name: "Nav",
      data:function(){
        return{

        }
      },methods:{
        logout:function(){
          var that = this;
          userLoginOut(function(data){
            //console.log(data);
            if(data.info == '登出成功'){
              that.$store.commit('editLogin');
              that.$store.commit('clearUser');
              that.$store.commit('clearHistory');
            }
          })
        }
      },
      computed:{
          isLogin:function(){
            return this.$store.state.isLogin;
          },
        getUser:function(){
          return this.$store.state.user;
        }
      }
    }
</script>

<style scoped>
  .navbar{
    background-color: #0084ff;
    color:#fff;
    /*height: 65px;*/
    border-radius: 0px;
  }
  .navbar-default .navbar-nav > li > a{
    color:#fff;
  }
  .navbar > .container .navbar-brand, .navbar > .container-fluid .navbar-brand{
    color:#fff;
  }
</style>
