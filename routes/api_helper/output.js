var mongoose = require('mongoose');

var News = mongoose.model('News');

var output = dateSearch;
var callbackG;

function dateSearch(query, callback) {
    callbackG = callback;
    if (query.instr_list != "" && query.tpc_list != "") {
        News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "instr_list": query.instr_list, "tpc_list": query.tpc_list}, call);
    } else if (query.instr_list != "") {
        News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "instr_list": query.instr_list}, call);
    } else if (query.tpc_list != "") {
        News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "tpc_list": query.tpc_list}, call);
    } else { 
        News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}}, call);
    }
}
function call(err, post) {
    callbackG(post);
}

module.exports = output;
