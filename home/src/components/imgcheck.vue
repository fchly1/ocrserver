<template>
  <div class="imgcheck ">
    <div class="form-group ">
      <input type="file" class="form-control" id="file" @change="filechange($event)" style="display: none"/>

    </div>

    <div class="input-group">
      <input type="text" class="form-control" aria-label="..." v-model="imgurl" placeholder="请输入网络图片url"/>
      <div class="input-group-btn">
        <button type="button" class="btn btn-default" v-on:click="urlcheck()" v-bind:disabled="isDisabled">检测图片</button>
        <button type="button" class="btn btn-default" v-on:click="upimgfile()" v-bind:disabled="isDisabled">图片/pdf上传
        </button>
      </div>

    </div>

    <div class="row showbox" v-for="item in items">
      <Showboxitem :item='item'/>

    </div>
    <canvas id="the-canvas"></canvas>


  </div>

</template>

<script>
  import Showboxitem from './showbox-item';
  import {uploadimgdist, imgurldist, pdftoimg} from './imgcheck.api';


  export default {
    name: 'imgcheck',
    components: {Showboxitem},
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        showtext: '',
        imgurl: '请输入网络图片url',
        isDisabled: null,
        items: [
          {
            text: '',
            file: '请输入网络图片url',
          }
        ]
      }
    },
    methods: {
      upimgfile: function () {
        document.getElementById('file').click();

      },
      filechange: function (e) {
        var that = this;
        //console.log(e);
        this.isDisabled = true;
        var file = e.target.files[0];
        var filetype = file.type;
        var filesize = file.size;
        var rex = /pdf|jpeg|png|jpg/;
        if (!rex.test(filetype)) {
          this.$store.commit('addInfoBox',{
            text:'请上传图片文件或者Pdf文件',
            type:'alert-danger'
          });
          this.isDisabled = null;
          return false;
        }
        if (filesize > 52428800) {
          this.$store.commit('addInfoBox',{
            text:'请上传小于50M的文件',
            type:'alert-danger'
          });
          this.isDisabled = null;

          return false;
        }
        if (filetype.indexOf('pdf') > -1) {
          pdftoimg(file, function (data) {
            //console.log(data);
            that.imgurl = data.file;
            that.items = [];
            that.isDisabled = null;
            data.map(function (item) {
              that.items.push(item);
            })

          })
        } else {
          // var formdata = new FormData();
          // formdata.append('upimgfile', e.target.files[0]);

          uploadimgdist(file, function (data) {
            //console.log(data);
            that.imgurl = data.file;
            that.items = [];
            that.isDisabled = null;
            that.items.push(data);
            that.$store.commit('addHistory',data);
          })
        }


      },
      urlcheck: function () {
        var that = this;
        that.isDisabled = true;
        var url = this.imgurl;
        var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?.(jpg|png|jpeg|bmp)/;

        if (!reg.test(url)) {
          this.$store.commit('addInfoBox',{
            text:'输入的网址不合法',
            type:'alert-danger'
          });
          //alert('输入的网址不合法');
          that.isDisabled = null;
        } else {
          imgurldist(url, function (data) {
            that.imgurl = data.file;
            that.items = [];
            that.isDisabled = null;
            that.items.push(data);
          })
        }
        ;
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


  .showbox {
    padding-top: 20px;
  }

  .urlinput {
    margin-bottom: 15px;
  }
</style>
