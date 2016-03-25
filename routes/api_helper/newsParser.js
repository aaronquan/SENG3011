var htmlparser = require("htmlparser2")
var mongoose = require('mongoose');

var News = mongoose.model('News');

var allNewsAttributes = News.schema.paths;

var newsAttributes = new Array(); //news attributes: headline, date, etc.
var codeAttributes = new Array(); //

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
for (key in newsAttributes){
	console.log(key);
	console.log(newsAttributes[key]);
}


var parser = new htmlparser.Parser({
	onopentag: function(name, attr){

	},
	onopentagname: function(name){
		if(name === 'ContentEnvelope'){
			console.log('Start news:');
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
				console.log(key+': '+text);
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
		}
	}
}, {decodeEntities: true, lowerCaseTags: false});

module.exports = parser;