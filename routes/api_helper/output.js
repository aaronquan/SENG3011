var mongoose = require('mongoose');

var News = mongoose.model('News');

var output = function(query, callback){
	var s_date = query.start_date;
	var e_date = query.end_date;
	News.find({"date": {"$gte": s_date, "$lte": e_date}}, function(err, post){
		callback(post);
	});
}

module.exports = output;