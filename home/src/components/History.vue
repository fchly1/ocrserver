<template>

  <div>
    <table class="table table-hover">
      <thead>
      <tr>
        <th>#</th>
        <th>文件</th>
        <th>文本</th>
        <th>时间</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(history,index) in showData">
        <td scope="row">{{ index + 1 }}</td>
        <td>
          <a :href="history.file" download="pdfocr">下载</a>
        </td>
        <td :data-clipboard-text="history.text" :id="'data' + (index + 1)" @click="copy($event)" data-toggle="tooltip"
            data-placement="bottom" title="双击复制">
          {{history.text | lettercut}}...

        </td>
        <td>
          {{history.time ? history.time : history.updatedAt | moment}}
        </td>
      </tr>
      </tbody>

    </table>
    <div>
      <ul class="pagination">
        <li><a href="#" @click="pageClick(currPage-2)">&laquo;</a></li>
        <li v-for="index in indexs" :class="{ 'active': currPage == index+1}">
          <a a href="#" @click="pageClick(index)">{{index+1}}</a>
        </li>
        <li><a href="#" @click="pageClick(currPage)">&raquo;</a></li>
      </ul>
    </div>
  </div>
</template>

<script>


  import Clipboard from 'clipboard';
  import $ from 'jquery';
  import moment from 'moment';

  export default {
    name: "History",
    data: function () {
      return {
        total: 1,
        currPage: 1,
        pageNum: 10,
        pages: 1,
        showData: [],
        pageData: this.$store.state.histories
      }
    },
    methods: {
      copy: function (ev) {
        var id = ev.target.id;
        let clipboard = new Clipboard('#' + id);
        clipboard.on('success', e => {
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          alert('浏览器不支持自动复制，请手动复制微信号')
          // 释放内存
          clipboard.destroy()
        })

      },
      pageClick: function (index) {

        this.currPage = index + 1;
        if (this.currPage < 1) {
          this.currPage = 1;
          return false;
        }else if(this.currPage>this.pages){
          this.currPage = this.pages;
          return false;
        }
        var startPos = index * this.pageNum;
        var endPos = (index + 1) * this.pageNum;
        if (endPos > this.total) {
          endPos = this.total;
        };
        this.showData = [];
        for (var i = startPos; i < endPos; i++) {
          this.showData.push(this.pageData[i]);
        };

      }
    },
    computed: {
      indexs: function () {
        var indexs = [];
        for (var i = 0; i < this.pages; i++) {
          indexs.push(i)
        }
        return indexs;
      }
    },
    filters: {
      lettercut: function (value) {
        if (!value) {
          return ''
        }
        ;
        //console.log(value);
        return value.substring(0, 35);
      },
      moment:function(value){
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    mouted: function () {
      $('[data-toggle="tooltip"]').tooltip();
      //this.pageClick(0);
    },
    created: function () {
      this.total = this.pageData.length;
      this.pages = Math.ceil(this.total / this.pageNum);
      this.pageClick(0);
    }

  }


</script>

<style scoped>
  th {
    text-align: center;
  }

  td button.btn {
    display: none;
  }

  td:hover button.btn {
    display: block;
  }
</style>
