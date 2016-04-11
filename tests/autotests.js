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
	async.each(testQueries, 
		function(query, cb){
			apiOptions['json'] = query;
			testDate(query, function(isDatePassed){
				if (isDatePassed){
					log.push('passed test ' + i);
				}else{
					log.push('failed test ' + i);
				}
				i += 1;
				cb();
			});
		},
		function (err){
			callback(log);
		});
};
function testDate(query, callback){
	var s_date = new Date(query['start_date']);
	var e_date = new Date(query['end_date']);
	request(apiOptions, function(err, res, body){
		var validDates = true;
		async.each(body, 
			function(news, cb){
				var date = new Date(news['date']);
				if(s_date > date && e_date < date){
					validDates = false;
				}
				cb();
			},
			function(err){
				callback(validDates);
			}
         );
	});
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
