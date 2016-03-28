var htmlparser = require("htmlparser2")
var mongoose = require('mongoose');

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

// looks through tags, adds them to a news object 
var parser = new htmlparser.Parser({
	onopentag: function(name, attr){
		//append instr codes and tpc codes to their corresponding list
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
					//console.log(key+': '+text);
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
				return console.log("News entry added: success")
			});
		}
	}
}, {decodeEntities: true, lowerCaseTags: false});

module.exports = parser;