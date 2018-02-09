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
      <tr v-for="(history,index) in HistoryData">
        <td scope="row">{{ index + 1 }}</td>
        <td>
          <a :href="history.file" download="pdfocr">下载</a>
        </td>
        <td :data-clipboard-text="history.text" :id="'data' + (index + 1)" @click="copy($event)" data-toggle="tooltip"
            data-placement="bottom" title="双击复制">
          {{history.text | lettercut}}...

        </td>
        <td>
          {{history.time ? history.time : history.updatedAt}}
        </td>
      </tr>
      </tbody>

    </table>
  </div>
</template>

<script>


  import Clipboard from 'clipboard';
  import $ from 'jquery';

  export default {
    name: "History",
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

      }
    },
    computed: {
      HistoryData: function () {
        return this.$store.state.histories;
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
      }
    },
    mouted: function () {
      $('[data-toggle="tooltip"]').tooltip();
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
