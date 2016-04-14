var mongoose = require('mongoose');
var request = require('request');
var async = require('async');

var News = mongoose.model('News');
var Query = mongoose.model('News');

var outputFunction = require('./../routes/api_helper/output');
//var newsParser = require('./../routes/api_helper/newsParser');

var apiOptions = {
	uri: 'http://pacificpygmyowl.herokuapp.com/api/query',
    //uri: 'localhost:3000/api/query',
	method: 'POST'
}
var allNews = {
	uri: 'http://pacificpygmyowl.herokuapp.com/api/news',
	//uri: 'http://localhost:3000/api/news',
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
        "end_date": "2015-10-01T00:06:00.000Z",
        "instr_list": ["KRW=","KREXGR=ECI"],
        "tpc_list": []
    },
    {
    	"start_date": "2015-10-01T00:00:00.092Z",
        "end_date": "2015-10-01T00:09:00.000Z",
        "instr_list": [],
        "tpc_list": ['GEN', 'ECI']
    },
    {
    	"start_date": "2015-10-01T00:00:00.092Z",
        "end_date": "2015-10-01T00:09:00.000Z",
        "instr_list": ['KRW='],
        "tpc_list": ['GEN', 'ECI']
    }
];

var tester = function(callback){
	var log = [];
	request(allNews, function(err, res, fullNews){
		fullNews = JSON.parse(fullNews);
		async.forEachOfSeries(testQueries, 
			function(query, index, cb){
				apiOptions['json'] = query;
				request(apiOptions, function(err, res, body){
					testDate(query, body, fullNews, function(isDatePassed, test){
						log.push(test);
						log.push(body.length);
						if (isDatePassed){
							log.push('passed test ' + index);
						}else{
							log.push('failed test ' + index);
						}
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
	var instr_list = query['instr_list'];
	console.log(instr_list.length);
	var tpc_list = query['tpc_list'];
	console.log(tpc_list.length);
	var newsTester = new Array();
	async.each(allNews, 
		function(news, cb){
			var date = new Date(news['date']);
			var hasList = false;
			var pushed = false;
			if(s_date <= date && e_date >= date){
				if(instr_list.length == 0 && tpc_list.length == 0){
					newsTester.push(news);
					console.log('help');
					pushed = true;
				}
				if(instr_list.length == 0){
					hasList = true;
				}
				else{
					for(i=0; i < instr_list.length; i++){
						//console.log(instr_list[i]);
						if(news['instr_list'].indexOf(instr_list[i]) != -1){							
							hasList = true;
							continue;
						}
					}
				}
				if(hasList && tpc_list.length == 0){
					if(pushed == false){
						newsTester.push(news);
					}
				}
				else if(hasList){
					for(i=0; i < tpc_list.length; i++){
						if(news['tpc_list'].indexOf(tpc_list[i]) != -1){

							newsTester.push(news);
							continue;
						}
					}
				}
			}
			cb();
		},
		function(err){
			if(body.length == newsTester.length){
				callback(true, newsTester.length);
			}else{
				callback(false, newsTester.length);
			}
		}
    );
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
