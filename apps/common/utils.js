module.exports = function (oldObj){
    var obj = {};
    for(var pop in oldObj){
        obj[pop] = oldObj[pop];
    }
    return obj;
}