var mongoose = require('mongoose');

var News = mongoose.model('News');

function getNewest(query, callback) {
    if (query.instr_list != "" && query.tpc_list != "") {
        var instr_split = query.instr_list[0].split(",");
        var tpc_split = query.tpc_list[0].split(",");
        News.find({"instr_list": {"$all": instr_split}, "tpc_list": {"$all": tpc_list}}, '-_id -__v').sort('-date').exec(function(err, ret) {
            callback(ret);
        });
    } else if (query.instr_list != "") {
        var instr_split = query.instr_list[0].split(",");
        News.find({"instr_list": {"$all": instr_split}},'-_id -__v').sort('-date').exec(function(err, ret) {
            callback(ret);
        });
    } else if (query.tpc_list != ""){
        var tpc_split = query.tpc_list[0].split(",");
        News.find({"tpc_list": {"$all": tpc_split}},'-_id -__v').sort('-date').exec(function(err, ret) {
            callback(ret);
        });
    } else {
        News.find({},'-_id -__v').sort('-date').exec(function(err, ret) {
            callback(ret);
        });
    }
}

module.exports = getNewest;
