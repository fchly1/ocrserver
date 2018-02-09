<template>
  <div id="app" >
    <Nav/>
    <div class="container">
      <div class="jumbotron">
        <h1>网络图片/本地图片识别</h1>
      </div>
      <router-view/>
    </div>

    <div class="info" v-for="item in infoBox">
      <transition
        name="custom-classes-transition"
        enter-active-class="animated tada"
        leave-active-class="animated bounceOutRight">
        <Vueinfobox :itemdata="item" />
      </transition>

    </div>
  </div>

</template>

<script>
  import Nav from './components/Nav';
  import Vueinfobox from './components/vue-infobox/vueinfobox';
  import request from 'superagent';

export default {
  name: 'App',
  components:{Nav,Vueinfobox},
  data:function(){
    return {
      infoBox:this.$store.state.infoBox
    }
  },
  created:function(){
    var that = this;
    request.get('/user/islogin')
      .end(function (err, res) {
        if (res.ok) {
          //cb(res.body);

          var data = res.body;
          //console.log(data)
          if(data.info === '非法访问'){return false;}
          that.$store.commit('editLogin');
          that.$store.commit('updateUser',data.user);
          if(data.user.histories.length > 0){
            for (var i=0 ;i<data.user.histories.length;i++){
              that.$store.commit('addlocalHistory',data.user.histories[i]);
            }
          }
          //that.$router.push('/');
        }

      })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
.info{
  position: fixed;
  right:10PX;
  bottom:10px;
  width: 300px;
}

</style>
