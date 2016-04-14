var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var xml = require('xml');

var parser = require('./api_helper/newsParser');
var outputFunction = require('./api_helper/output');
var getNewest = require('./api_helper/getNewest');
var searchDb = require('./api_helper/searchAlgos');
var autoTester = require('./../tests/autotests.js');

var Query = mongoose.model('Query')
var News = mongoose.model('News');

var sourceFile = 'news_files/News_data_extract.txt';

router.route('')
	.get(function(req, res){
		res.send('The api path for news');

	});

//api/query is the route that applications are going to use.
router.route('/query')
	.post(function(req, res){
		var query = new Query();
		query.start_date = req.body.start_date;
		query.end_date = req.body.end_date;
		query.instr_list = req.body.instr_list;
		query.tpc_list = req.body.tpc_list;
		//sends json date in the format of a news query in the spec
		outputFunction(query, function(info){
			res.json(info);
		});
	});
router.route('/newest')
	.post(function(req, res){
		var query = new Query();
		query.instr_list = req.body.instr_list;
		query.tpc_list = req.body.tpc_list;
		getNewest(query, function(info){
			res.json(info);
		});
	});

router.route('/source')
	.get(function(req, res){
		fs.readFile(sourceFile, function(err, data){
			if (err) return res.send(err);
			return res.send(xml(data.toString()));
		});
	});

router.route('/reset')
	.get(function(req, res){
		fs.readFile(sourceFile, function(err, data){
			if (err) return res.send(err);
			News.remove({}, function(err){
				if(err) return console.log(err);
			});
			parser['parser'].write(data.toString());
			return res.send("Successfully reset database");
		});
	});

router.route('/autotest')
	.get(function(req, res){
		autoTester(function(log){
			res.send(log);
		});
	});

router.route('/news')
	//views all news
	.get(function(req, res){
		News.find({}, '-_id -__v').sort('-date').exec(function(err, data){
			if (err) return res.send(500, err);
			res.json(data);
		})
	});
/**
router.route('/news/:id')
	//gets a specific news article with id
	.get(function(req, res){
		News.findById(req.params.id, function(err, post){
			if(err) return res.send(err)
			return res.json(post);
		});
	})
	//removes a news article
	.delete(function(req, res){
		News.remove({
			_id: req.params.id 
		}, function(err){
			if(err) return res.send(err)
			return res.json("Deleted");
		});
	});
    **/
router.route('/instr_list')
	.get(function(req,res){
		var array = fs.readFileSync('routes/code_data/instr_codes.txt').toString().split("\n");
		array.pop();
		res.send(array);
	});
router.route('/tpc_list')
	.get(function(req,res){
		var array = fs.readFileSync('routes/code_data/tpc_codes.txt').toString().split("\n");
		array.pop();
		res.send(array);
	});

//any routes below this can be put inside appNg.js
router.route('/input')
	.get(function(req, res){
		var input = 
			{
				"start_date": "yyyy-MM-ddTHH:mm:ss.SSSZ",
				"end_date": "yyyy-MM-ddTHH:mm:ss.SSSZ",
				"tpc_list": "[]",
				"instr_list": "[]"
			}	
		return res.json(input);
	});
router.route('/inputExample')
	.get(function(req, res){
		var inputEg = 
			{
				"start_date": "2015-10-01T00:00:00.092Z",
				"end_date": "2015-10-01T00:15:00.000Z",
				"instr_list": ["KRW=","KREXGR=ECI"],
				"tpc_list": []
			}	
		return res.json(inputEg);
	});

module.exports = router;
