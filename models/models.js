var mongoose = require('mongoose');

var newsSchema = mongoose.Schema({
	title: String,
	author: String,
	//date: Date,
	contents: String,
});

var topicsSchema =  mongoose.Schema({
	code: String,
	name: String,
	section: String
});

mongoose.model("News", newsSchema);
mongoose.model("Topics", topicsSchema);