var mongoose = require('mongoose');

var News = mongoose.model('News');

var callbackG;

function search(query, callback) {
    if (query.start_date == undefined || query.end_date == undefined) {
        callback({"Error": "start_date or end_date undefined"});
    } else {
        var last;
        News.find(function (err, post) {
            console.log(post);
            last = post[0]._id;
            dateSearch(query, callback, last);
        }).limit(query.range_start).sort({_id: -1}).limit(1);
    }
}
function dateSearch(query, callback, last) {
    callbackG = callback;
    console.log(query.instr_list);
    if ((query.instr_list != undefined && query.tpc_list != undefined) && (query.instr_list != "" && query.tpc_list != "")) {
        var instr_split = query.instr_list.toString().split(/[,\ *]/);
        var tpc_split = query.tpc_list.toString().split(/[,\ *]/);
        News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "instr_list": {"$in": instr_split}, "tpc_list": {"$in": tpc_split}}, '-_id -__v', call).skip(query.range_start).limit(query.range_length);
    } else if (query.instr_list != "" && query.instr_list != undefined) {
        var instr_split = query.instr_list.toString().split(/[,\ *]/);
        News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "instr_list": {"$in": instr_split}}, '-__v -_id', call).skip(query.range_start).limit(query.range_length);
    } else if (query.tpc_list != "" && query.tpc_list != undefined) {
        var tpc_split = query.tpc_list.toString().split(/[,\ *]/);
        News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "tpc_list": {"$in": tpc_split}}, '-_id -__v', call).skip(query.range_start).limit(query.range_length);
    } else { 
        News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}}, '-_id -__v', call).skip(query.range_start).limit(query.range_length);
    }
}
function call(err, post) {
    //console.log(post);
    //console.log("                                     Finished");
    callbackG(post);
}

module.exports = search;
