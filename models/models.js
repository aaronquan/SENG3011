var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	start_date: String,
	end_date: String,
	instr_list: String,
	tpc_list: String
});

var newsSchema = mongoose.Schema({
	title: String,
	author: String,
	//date: Date,
	contents: String
});

var topicsSchema =  mongoose.Schema({
	code: String,
	name: String,
	section: String
});

mongoose.model("Query", requestSchema);
mongoose.model("News", newsSchema);
mongoose.model("Topics", topicsSchema);