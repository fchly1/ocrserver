<template>
    <div class="alert alert-dismissable" :class="itemdata.type" v-if="stutas">
      <button type="button" class="close" data-dismiss="alert"
              aria-hidden="true">
        &times;
      </button>
      <p>{{itemdata.text}}</p>
    </div>
</template>

<script>
    export default {
        name: "vueinfobox",
        props:['itemdata'],
        data:function(){
          return {
            stutas:true
          }
        },
      created:function(){
          var that = this;
          setTimeout(function(){
            that.stutas = false;
            that.$store.commit('delInfoBox',that.itemdata);
          },this.itemdata.time?this.itemdata.time:3000);
      }
    }
</script>

<style scoped>

</style>
