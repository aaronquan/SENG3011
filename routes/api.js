var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var xml = require('xml');

var parser = require('./api_helper/newsParser');
var outputFunction = require('./api_helper/output');
var searchDb = require('./api_helper/searchAlgos');

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
			parser.write(data.toString());
			return res.send("Successfully reset database");
		});
	});

router.route('/news')
	//views all news
	.get(function(req, res){
		News.find({}).sort('-date').exec(function(err, data){
			if (err) return res.send(500, err);
			return res.json(data);
		})
	});

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


module.exports = router;
