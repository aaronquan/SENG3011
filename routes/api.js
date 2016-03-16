var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var News = mongoose.model('News');

router.route('')
	.get(function(req, res){
		res.send('The api path for news')
	});

router.route('/news')
	.get(function(req, res){
		News.find(function(err, data){
			if (err) return res.send(500, err);
			return res.json(data);
		})
	})

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
	.get(function(req, res){
		News.findById(req.params.id, function(err, post){
			if(err) return res.send(err)
			return res.json(post);
		});
	})

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
	.delete(function(req, res){
		News.remove({
			_id: req.params.id 
		}, function(err){
			if(err) return res.send(err)
			return res.json("Deleted");
		});
	});


module.exports = router;