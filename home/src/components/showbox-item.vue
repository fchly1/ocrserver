<template>
    <div class="showbox-item">
      <div class="imgbox col-md-5">
        <img :src="item.file" alt="" class="img-responsive" />
      </div>

      <div class="col-md-7">
        <textarea name="showtext" class="form-control" style="width: 100%;height: 300px" >{{item.text}}</textarea>
      </div>

    </div>
</template>

<script>
    export default {
        name: "showboxitem",
        props:['item'],
        data(){
          return {
            imgurl:'',
            showtext:''
          }
        }
    }
</script>

<style scoped>
  .imgbox{
    /*width:300px;*/
    height:300px;
    line-height: 300px;
    text-align: center;
    border: 1px solid #c0c0c0;
    overflow: auto;
    margin-bottom: 15px;
  }
</style>
