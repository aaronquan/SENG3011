var mongoose = require('mongoose');
var request = require('request');
var async = require('async');

var News = mongoose.model('News');
var Query = mongoose.model('News');

var outputFunction = require('./../routes/api_helper/output');
//var newsParser = require('./../routes/api_helper/newsParser');

var apiOptions = {
	uri: 'http://pacificpygmyowl.herokuapp.com/api/query',
//    uri: 'localhost:3000/api/query',
	method: 'POST'
}
var allNews = {
	//uri: 'http://pacificpygmyowl.herokuapp.com/api/news',
	uri: 'http://localhost:3000/api/news',
	method: 'GET',
	headers: {
        'Content-Type': 'application/json'
    }
}

//testQueries temp testing
var testQueries = [
    {
	    'start_date': '2015-10-01T00:09:00.092Z',
    	'end_date': '2015-10-01T00:09:31.242Z',
	    'instr_list': [],
    	'tpc_list': []
    },
    {
        "start_date": "2015-10-01T00:00:00.092Z",
        "end_date": "2015-10-01T00:15:00.000Z",
        "instr_list": ["KRW=,KREXGR=ECI"],
        "tpc_list": []
    }
];

var tester = function(callback){
	var log = [];
	var i = 0;
	request(allNews, function(err, res, fullNews){
		fullNews = JSON.parse(fullNews);
		async.eachSeries(testQueries, 
			function(query, cb){
				apiOptions['json'] = query;
				request(apiOptions, function(err, res, body){
					testDate(query, body, fullNews, function(isDatePassed){
						if (isDatePassed){
							log.push('passed test ' + i);
						}else{
							log.push('failed test ' + i);
						}
						i += 1;
						cb();
					});
				});
			},
			function (err){
				callback(log);
			}
		);
	});
};
function testDate(query, body, allNews, callback){
	var s_date = new Date(query['start_date']);
	var e_date = new Date(query['end_date']);
	var newsTester = new Array();
	async.each(allNews, 
		function(news, cb){
			var date = new Date(news['date']);
			if(s_date <= date && e_date >= date){
				newsTester.push(news);
			}
			cb();
		},
		function(err){
			if(body.length == newsTester.length){
				callback(true);
			}else{
				callback(false);
			}
		}
    );
}
function testInstrCodes(){

}
function testTpcCodes(){

}

/**function getDateRange(cb){
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
}**/

module.exports = tester;
