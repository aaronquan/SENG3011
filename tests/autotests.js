var mongoose = require('mongoose');

var News = mongoose.model('News');
var Query = mongoose.model('News');

var outputFunction = require('./../routes/api_helper/output');
//var newsParser = require('./../routes/api_helper/newsParser');

//testqueries temp testing
var q1 = new Query;
q1.start_date = "2015-10-01T00:09:00.092Z";
q1.end_date = "2015-10-01T00:09:31.242Z";
q1.instr_list = [];
q1.tpc_list = [];
var q2 = new Query;
q2.start_date = "2015-10-01T00:09:00.092Z";
q2.end_date = "2015-10-01T00:15:00.000Z";
q2.instr_list = ["KRW=,KREXGR=ECI"];
q2.tpc_list = [];
var testQueries = [q1, q2];

var tester = function(callback){
	var errorLog = new Array();
	for (var query in testQueries){

		testDate(query);
	}
	callback("hi");
};

function testDate(query){
	var s_date = new Date(query['start_date']);
	var e_date = new Date(query['end_date']);
	outputFunction(query, function(info){
		console.log(info);
		for (var news in info){
			console.log(news['date']);
		}
	});
}

function getDateRange(cb){
	News.find({}).sort('-date').exec(function(err, data){
		var dateR = {};
		dateR['min_date'] = data[0]['date'];
		dateR['max_date'] = data[data.length-1]['date'];
		cb(dateR);
	});
}

function randomQuery(n){
	getDateRange(function(range){

	});
}

module.exports = tester;