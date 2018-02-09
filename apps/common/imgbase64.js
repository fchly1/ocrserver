var fs = require("fs");
var request = require('superagent');


/**
 * 下载远程文件
 * @param filepath  远程文件地址
 * @param cb    下载完成后的处理函数，传的是保存好的本地文件地址
 */
function download(filepath,cb) {
    var currDate = new Date();
    const savePath = './uploads/images/' +   currDate.getFullYear() + '-' + (currDate.getMonth()+1) + '-' + currDate.getDate() + '/';
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    var url = filepath;
    var name = url.slice(url.lastIndexOf('/') + 1);
    var file = request(url).pipe(fs.createWriteStream(savePath + name));
    //当文件写入完成时把文件地址传出去
    file.on('finish', function(){
       cb(file.path);
    });

}


/**
 * 图片转换成base64
 * @param path  文件地址必须有
 * @returns {string}  返回编码
 */
function imgbase64n(path){
    var bData = fs.readFileSync(path);
    var base64Str = bData.toString('base64');
    //var datauri = 'data:image/png;base64,' + base64Str;
    var datauri = base64Str;
    return datauri;
}


module.exports = function (path,cb){
    //判断是否是网络文件，是的话则先下载到本地

    var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?.(jpg|png|jpeg|bmp)/;
    console.log(reg.test(path));
    if(reg.test(path)){
        // download(path,function(filepath){
        //     var datauri = imgbase64n(filepath);
        //     cb(datauri);
        // });
        console.log('....')
        cb(path);
    }else{
        var datauri = imgbase64n(path);
        cb(datauri);

    }
}