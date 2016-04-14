var mongoose = require('mongoose');

var News = mongoose.model('News');

var callbackG;

function dateSearch(query, callback) {
    callbackG = callback;
    if (query.start_date == undefined || query.end_date == undefined) {
        callback({"Error": "start_date or end_date undefined"});
    } else {
        if (query.instr_list != "" && query.tpc_list != "") {
            var instr_split = query.instr_list.toString().split(/[,\ *]/);
            var tpc_split = query.tpc_list.toString().split(/[,\ *]/);
            console.log("Instr");
            console.log(instr_split)
            console.log("TPC");
            console.log(tpc_split)
            News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "instr_list": {"$in": instr_split}, "tpc_list": {"$in": tpc_split}}, '-_id -__v', call);
        } else if (query.instr_list != "") {
            var instr_split = query.instr_list.toString().split(",");
            console.log("Instr");
            console.log(instr_split)
            News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "instr_list": {"$in": instr_split}}, '-__v -_id', call);
        } else if (query.tpc_list != "") {
            var tpc_split = query.tpc_list.toString().split(",");
            console.log("TPC");
            console.log(tpc_split)
            News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}, "tpc_list": {"$in": tpc_split}}, '-_id -__v', call);
        } else { 
            News.find({"date": {"$gte": query.start_date, "$lte": query.end_date}}, '-_id -__v', call);
        }
    }
}
function call(err, post) {
    console.log("                                     Finished");
    callbackG(post);
}

module.exports = dateSearch;
