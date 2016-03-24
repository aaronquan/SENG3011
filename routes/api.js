var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');

var Query = mongoose.model('Query')
var News = mongoose.model('News');



router.route('')
	.get(function(req, res){
		res.send('The api path for news')

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
		res.json(query);

	});

router.route('/source')
	.get(function(req, res){
		fs.readFile('news_files/mini_data_extract.txt', function(err, data){
			if (err) {
       			return res.send(err);
   			}
			return res.send(data.toString());
		});
	});

router.route('/news')
	//views all news
	.get(function(req, res){
		News.find(function(err, data){
			if (err) return res.send(500, err);
			return res.json(data);
		})
	})
	//adds a new news article into the database
	.post(function(req, res){
		var news = new News();
		news.title = req.body.title;
		news.author = req.body.author;
		//news.date = req.body.date;
		news.contents = req.body.contents;
		news.save(function(err, post){
			if (err) return res.send(500, err);	
			return res.json(news);
		});
	});

router.route('/news/:id')
	//gets a specific news article with id
	.get(function(req, res){
		News.findById(req.params.id, function(err, post){
			if(err) return res.send(err)
			return res.json(post);
		});
	})
	//modifies and news with id
	.put(function(req, res){
		News.findById(req.params.id, function(err, post){
			news.title = req.body.title;
			news.created_by = req.body.created_by;
			//news.date = req.body.date;
			news.contents = req.body.contents;
			news.save(function(err, post){
				if (err) return res.send(500, err);
				return res.json(news);
			});
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