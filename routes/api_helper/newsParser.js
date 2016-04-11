var htmlparser = require("htmlparser2");
var mongoose = require('mongoose');
var fs = require('fs');

var News = mongoose.model('News');

var allNewsAttributes = News.schema.paths;

var newsAttributes = new Array(); //news attributes: headline, date, etc.
var codeAttributes = new Array(); //code attributes: instr_list, tpc_list

// creates the attribute data streams
function newNews(){
	for (attr in allNewsAttributes){
		if (allNewsAttributes[attr]['caster']){
			codeAttributes[allNewsAttributes[attr]['path']] = [];
		}
		else if (allNewsAttributes[attr]['path'] == 'date'){
			newsAttributes['TimeStamp'] = {'isOpen':false, 'value':undefined};
		}
		else if (['_id', '__v'].indexOf(allNewsAttributes[attr]['path']) == -1){
			newsAttributes[allNewsAttributes[attr]['path']] = {'isOpen':false, 'value':''};
		}
	}
}
var instr_codes_added = [];
var tpc_codes_added = [];
var stream = fs.createWriteStream("routes/code_data/instr_codes.txt", {flags: 'r+'});
var streamTpc = fs.createWriteStream("routes/code_data/tpc_codes.txt", {flags: 'r+'});
// looks through tags, adds them to a news object 
var parser = new htmlparser.Parser({
	onopentag: function(name, attr){
		//append instr codes and tpc codes to their corresponding list
		if (name === 'subject'){
			var code = attr['qcode'];
			if (/^N2:/.test(code)){
				code = code.replace(/^N2:/, '');
				codeAttributes['tpc_list'].push(code);
				if (tpc_codes_added.indexOf(code) == -1){
					tpc_codes_added.push(code);
					streamTpc.write(code+"\n");
				}
			}
			if (/^R:/.test(code)){
				code = code.replace(/^R:/, '');
				codeAttributes['instr_list'].push(code);
				if (instr_codes_added.indexOf(code) == -1){
					instr_codes_added.push(code);
					stream.write(code+"\n");
				}
			}
		}
	},
	onopentagname: function(name){
		if(name === 'ContentEnvelope'){
			//console.log('Start news:');
			//clear current news object
			newNews();
		}
		for(key in newsAttributes){
			if(name === key){
				newsAttributes[key]['isOpen'] = true;
			}
		}
	},
	ontext: function(text){
		for(key in newsAttributes){
			if(newsAttributes[key]['isOpen']){
				if (key == 'TimeStamp'){
					var date = new Date(text);
					newsAttributes[key]['value'] = date;
				}else{
					newsAttributes[key]['value'] += text;
					//console.log(key+': '+text);
				}
			}
		}
	},
	onclosetag: function(name){
		for(key in newsAttributes){
			if(name === key){
				newsAttributes[key]['isOpen'] = false;
			}
		}
		if(name === 'ContentEnvelope'){
			//console.log('End news');
			//add to database here
			
			var news = new News();
			news.date = newsAttributes['TimeStamp']['value'];
			news.headline = newsAttributes['headline']['value'];
			news.body = newsAttributes['body']['value'];
			news.instr_list = codeAttributes['instr_list'];
			news.tpc_list = codeAttributes['tpc_list'];
			news.save(function(err, post){
				if (err) return console.log(err);
				//return console.log("News entry added: success")
			});
		}
	}
}, {decodeEntities: true, lowerCaseTags: false});

module.exports = {parser: parser};