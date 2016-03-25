var htmlparser = require("htmlparser2")
var mongoose = require('mongoose');

var News = mongoose.model('News');

var allNewsAttributes = News.schema.paths;

var newsAttributes = new Array(); //news attributes: headline, date, etc.
var codeAttributes = new Array(); //code attributes: instr_list, tpc_list

for (attr in allNewsAttributes){
	if (allNewsAttributes[attr]['caster']){
		codeAttributes[allNewsAttributes[attr]['path']] = [];
	}
	else if (allNewsAttributes[attr]['path'] == 'date'){
		newsAttributes['TimeStamp'] = {'isOpen':false, 'value':''};
	}
	else if (['_id', '__v'].indexOf(allNewsAttributes[attr]['path']) == -1){
		newsAttributes[allNewsAttributes[attr]['path']] = {'isOpen':false, 'value':''};
	}
}
var parser = new htmlparser.Parser({
	onopentag: function(name, attr){
		//append instr codes and tpc codes to their corresponding list
	},
	onopentagname: function(name){
		if(name === 'ContentEnvelope'){
			console.log('Start news:');
			//clear current news object
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
					//make time object from string
					console.log(key+': '+text);
				}else{
					newsAttributes[key]['value'] += text
					console.log(key+': '+text);
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
			console.log('End news');
			//add to database here
		}
	}
}, {decodeEntities: true, lowerCaseTags: false});

module.exports = parser;