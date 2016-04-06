var mongoose = require('mongoose');

var News = mongoose.model('News');

var output = dateSearch;
var callbackG;

function dateSearch(query, callback) {
    callbackG = callback;
    if (query.start_date == undefined || query.end_date == undefined) {
        callback({"Error": "Date fields are either incorrectly formatted or empty."});
    } else {
        if (query.instr_list != "" && query.tpc_list != "") {
            var instr_split = query.instr_list[0].split(",");
            var tpc_split = query.tpc_list[0].split(",");
            News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "instr_list": {"$all": instr_split}, "tpc_list": {"$all": tpc_split}}, '-_id -__v', call);
        } else if (query.instr_list != "") {
            var instr_split = query.instr_list[0].split(",");
            News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "instr_list": {"$all": instr_split}}, '-__v -_id', call);
        } else if (query.tpc_list != "") {
            var tpc_split = query.tpc_list[0].split(",");
            News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "tpc_list": {"$all": tpc_split}}, '-_id -__v', call);
        } else { 
            News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}}, '-_id -__v', call);
        }
    }
}
function call(err, post) {
    callbackG(post);
}

module.exports = output;
