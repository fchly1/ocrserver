import {host} from '../config/index'
import request from 'superagent'
import pdfjs from 'pdfjs-dist-for-node'


/**
 * 上传单个图片识别
 * @param formdata 文件数据
 * @param cb 返回识别TXT
 */
export const uploadimgdist = function (formdata, cb) {
  request.post(host + 'upload')
    .attach('upimgfile', formdata)
    //.send(formdata)
    .end(function (err, res) {
      if (res.ok) {
        cb(res.body);
      }

    })
}

/**
 * 网络图片识别
 * @param url 网络图片地址
 * @param cb 返回识别TXT
 */
export const imgurldist = function (url, cb) {
  request.post(host + 'urlocr')
    .send({'imgurl': url})
    .end(function (err, res) {
      if (res.ok) {
        cb(res.body);
      }

    })
}


export const pdftoimg = function (formdata, cb) {
  request.post(host + 'upload')
    .attach('upimgfile', formdata)
    //.send(formdata)
    .end(function (err, res) {
      if (res.ok) {
        var upfile = res.body.file;
        var imgarr = []
        pdfjs.getDocument(upfile).then(function (pdf) {
          renderPage(1, pdf, imgarr, function (data) {
            cb(data);
          })
        })
      }

    })
}

/**
 * pdf单页转换成img-base64
 * @param num 第几页
 * @param pdf pdf对象
 * @param imgarr 返回结果数组
 * @param cb
 */
function renderPage(num, pdf, imgarr, cb) {
  var numpages = pdf.numPages;
  pdf.getPage(num).then(function (page) {

    var scale = 1.5;
    var viewport = page.getViewport(scale);

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    page.render(renderContext).then(function () {
      var database64 = canvas.toDataURL().replace('data:image/png;base64,', '');
      imgarr.push(database64);
      if (num < numpages) {
        num++;
        renderPage(num, pdf, imgarr, cb);
      } else {
        batchOcr(imgarr, cb)
      }
    });
  })
}

function batchOcr(data, cb) {
  request.post(host + 'batchocr')
    .send({'imgs': data})
    .end(function (err, res) {
      if (res.ok) {
        for (var i = 0; i < data.length; i++) {
          res.body[i].file = 'data:image/png;base64,' + data[i];
        }
        cb(res.body);
      }

    })
}









