var mongoose = require('mongoose');


//the query schema (may use date object insead of string for dates)
var requestSchema = mongoose.Schema({
	start_date: String,
	end_date: String,
	instr_list: [String],
	tpc_list: [String]
});

//news format in the database, subject to change
var newsSchema = mongoose.Schema({
	date: Date,
	instr_list: [String],
	tpc_list: [String],
	headline: String,
	body: String

});

//topics database format
var topicsSchema =  mongoose.Schema({
	code: String,
	name: String,
	section: String
});

mongoose.model("Query", requestSchema);
mongoose.model("News", newsSchema);
mongoose.model("Topics", topicsSchema);