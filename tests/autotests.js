var mongoose = require('mongoose');
var request = require('request');
var async = require('async');

//for the 
//mongoose.connect("mongodb://aaronq:newsapi@ds015508.mlab.com:15508/seng3011-news");

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
        "instr_list": ["KRW="],
        "tpc_list": []
    },
    {
    	"start_date": "2015-10-01T00:00:00.092Z",
        "end_date": "2015-10-01T00:09:00.000Z",
        "instr_list": [],
        "tpc_list": ['GEN']
    },
    {
    	"start_date": "2015-10-01T00:00:00.092Z",
        "end_date": "2015-10-01T00:09:00.000Z",
        "instr_list": ['KRW='],
        "tpc_list": ['GEN', 'ECI']
    },
    {
    	"start_date": "2015-10-01T00:03:00.092Z",
        "end_date": "2015-10-01T00:10:00.000Z",
        "instr_list": ["OCDO.L","GLEN.L","BEG.L","CVT.AX","STL.AX"],
        "tpc_list": ["GEN", "ECI", "MV", "TRD", "LEN"]	
    },
    {
    	"start_date": "2015-10-01T00:02:00.092Z",
        "end_date": "2015-10-01T00:04:00.000Z",
        "instr_list": ["OCDO.L","GLEN.L","BEG.L","CVT.AX","STL.AX"],
        "tpc_list": ["GEN", "ECI", "MV", "TRD", "LEN", "WASH"]	
    },
    {
    	"start_date": "2016-10-01T00:02:00.092Z",
        "end_date": "2016-10-01T00:04:00.000Z",
        "instr_list": [],
        "tpc_list": []	
    },
    {
    	"start_date": "2016-10-01T00:02:00.092Z",
        "end_date": "2015-10-01T00:04:00.000Z",
        "instr_list": [],
        "tpc_list": ["MV", "TRD", "LEN", "WASH"]	
    },
    {
    	"start_date": "2015-10-01T00:02:00.092Z",
        "end_date": "2015-10-01T00:04:00.000Z",
        "instr_list": [],
        "tpc_list": ["GENO"]	
    },
];

var tester = function(callback){
	var log = [];
	request(allNews, function(err, res, fullNews){
		fullNews = JSON.parse(fullNews);
		async.forEachOfSeries(testQueries, 
			function(query, index, cb){
				apiOptions['json'] = query;
				request(apiOptions, function(err, res, body){
					testQuery(query, body, fullNews, function(isDatePassed, test){
						if (isDatePassed){
							log.push('passed test ' + index);
						}else{
							log.push('failed test ' + index);
							log.push(test.length + ' entries found in test');
							log.push(body.length + ' entries found in api');
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

//matches the api query response

function testQuery(query, body, allNews, callback){
	var s_date = new Date(query['start_date']);
	var e_date = new Date(query['end_date']);
	var instr_list = query['instr_list'];
	var tpc_list = query['tpc_list'];
	var newsTester = new Array();
	async.each(allNews, 
		function(news, cb){
			var date = new Date(news['date']);
			var hasList = false;
			var pushed = false;
			// tests whether the current news article matches the query requirements
			if(s_date <= date && e_date >= date){
				if(instr_list.length == 0 && tpc_list.length == 0){
					newsTester.push(news);
					pushed = true;
				}
				if(instr_list.length == 0){
					hasList = true;
				}
				else{
					for(i=0; i < instr_list.length; i++){
						if(news['instr_list'].indexOf(instr_list[i]) != -1){							
							hasList = true;
							break;
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
							break;
						}
					}
				}
			}
			cb();
		},
		function(err){
			if(body.length == newsTester.length){
				callback(true, newsTester);
			}else{
				callback(false, newsTester);
			}
		}
    );
}

function getDateRange(cb){
	News.find({}).sort('-date').exec(function(err, data){
		var dateR = {};
		dateR['min_date'] = data[0]['date'];
		dateR['max_date'] = data[data.length-1]['date'];
		cb(dateR);
	});
}

//not using anymore, cant be bothered
function randomQuery(cb){
	async.parallel([
		function(callback){
			getDateRange(function(range){
				var start = new Date(range['min_date']);
				var end = new Date(range['max_date']);
				var diff = (start.getDate()-end.getDate())/1000
				callback(null, {'start_date':range['min_date'], 
					'end_date':range['max_date']});
			})
		},
		function(callback){
			request({uri:'http://pacificpygmyowl.herokuapp.com/api/tpc_list', method:'GET'}, 
			function(err, res, body){
				ns = res.body.replace(/\r/gi, "");
				tpc_list = JSON.parse(ns);
				callback(null, tpc_list);
			})
		},
		function(callback){
			request({uri:'http://pacificpygmyowl.herokuapp.com/api/instr_list', method:'GET'}, 
			function(err, res, body){
				ns = res.body.replace(/\r/gi, "");
				instr_list = JSON.parse(ns);
				callback(null, instr_list);
			})
		}
	], 
	function(err, result){
		var query = result[0];
		query['tpc_list'] = result[1];
		query['instr_list'] = result[2];
		cb(query)
	});
}

module.exports = tester;
