var crypto = require('crypto');
var fs = require('fs');

module.exports = function (file,cb){
    var rs = fs.createReadStream(file);
    var hash = crypto.createHash('md5');
    var fHash = '';
    rs.on('data', hash.update.bind(hash));
    rs.on('end', function () {
        fHash = hash.digest('hex');
        //console.log(hash.digest('hex'));
        cb(fHash);
    });
}