var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var xml = require('xml');
var csv = require('csv-streamify');

var parser = require('./api_helper/newsParser');
var outputFunction = require('./api_helper/output');
var getNewest = require('./api_helper/getNewest');
var searchDb = require('./api_helper/searchAlgos');
var autoTester = require('./../tests/autotests.js');

var Query = mongoose.model('Query')
var News = mongoose.model('News');

var tpc_list_source = 'code_data/tpc_codes.txt';
var instr_list_source = 'code_data/instr_codes.txt';

var sourceFile = 'news_files/News_data_extract.txt';

//for database holder only - files to large for repository
var sourceDir = '../reuters-data/data';
var sourceDir2 = '../reuters-data/data2';

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
router.route('/newest')
	.post(function(req, res){
		var query = new Query();
		query.instr_list = req.body.instr_list;
		query.tpc_list = req.body.tpc_list;
		getNewest(query, function(info){
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

router.route('/original')
	.get(function(req, res){
		fs.readFile(sourceFile, function(err, data){
			if (err) return res.send(err);
			News.remove({}, function(err){
				if(err) return console.log(err);
			});
			parser['parser'].write(data.toString());
			return res.send("Successfully reset database");
		});
	});


router.route('/data1')
	.get(function(req, res){
		fs.readdir(sourceDir, function(err, files){
			files.forEach( function(file, index) {
				fs.readFile(sourceDir+'/'+file, function(err, data){
					if (err) return res.send(err);
					parser['parser'].write(data.toString());
					if (index == 0){
						res.send("Reset database");
					}
				});
			});
		});
	});
router.route('/data2')
	.get(function(req, res){
		fs.readdir(sourceDir2, function(err, files){
			files.forEach( function(file, index) {
				fs.readFile(sourceDir2+'/'+file, function(err, data){
					if (err) return res.send(err);
					parser['parser'].write(data.toString());
					if (index == 0){
						res.send("Reset database");
					}
				});
			});
		});
	});

router.route('/delete')
	.get(function(req, res){
		fs.writeFile(tpc_list_source, '', function(){console.log('tpc_list deleted')})
		fs.writeFile(instr_list_source, '', function(){console.log('instr_list deleted')})
		News.remove({}, function(err){
			if(err) console.log(err);
			res.send('Deleted database');
		});
	});

router.route('/autotest')
	.get(function(req, res){
		autoTester(function(log){
			res.send(log);
		});
	});

router.route('/news')
	//views all news
	.get(function(req, res){
		News.find({}, '-_id -__v').sort('-date').exec(function(err, data){
			if (err) return res.send(500, err);
			res.json(data);
		})
	});
/**
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
    **/
router.route('/instr_list')
	.get(function(req,res){
		var array = fs.readFileSync('routes/code_data/instr_codes.txt').toString().split("\n");
		array.pop();
		res.send(array);
	});

router.route('/instr_list_full')
	.get(function(req,res){
		/*
		var all_array = [];
		var array = fs.readFileSync('routes/code_data/instr_codes.txt').toString().split("\n");
		array.pop();
		var codes_obj = [];
		for (var i = 0; i < array.length; i++) {
			codes_obj.push({code:array[i],name:'',description:''});
		}
		all_array.push({section: 'General', codes: codes_obj});
		*/
		//Extract all ASX Company Codes from the CSV file
		var csvToJson = csv({objectMode: true}); //CSV to JSON parser
		var asx_codes = []
		var readable = fs.createReadStream('routes/code_data/ASXListedCompanies.csv').pipe(csvToJson);
		readable.on('data', function(data) {
			data[1] = data[1].replace(/ *\r/, '');
			asx_codes.push({code:data[1]+".AX",name:data[0],description:''});
		});
		readable.on('end', function() {
			all_array.push({section: 'ASX Company Codes', codes: asx_codes});
			res.send(all_array);
		});
	});

router.route('/tpc_list')
	.get(function(req,res){
		var array = fs.readFileSync('routes/code_data/tpc_codes.txt').toString().split("\n");
		array.pop();
		res.send(array);
	});

router.route('/tpc_list_full')
	.get(function(req,res){
		var csvToJson = csv({objectMode: true}); //CSV to JSON parser
		var sections = []; //array of section objects
		var section_name;
		var codes = []
		var readable = fs.createReadStream('routes/code_data/topic_codes.csv').pipe(csvToJson);
		// loops through adding codes (as objects) to a list
		// when it hits a new section it saves the existing list of codes with their section
		// and adds that object to the sections array
		readable.on('data', function(data) {
 			if (/[A-Z0-9+ ]+$/.test(data[0])) {
				data[2] = data[2].replace(/ *\r/, '');
				codes.push({code:data[0],name:data[1],description:data[2]});
			} else if (/[A-Z]/.test(data[0])) {
				if (section_name) { //if section_name is not null
					sections.push({section:section_name,codes:codes});
				}
				section_name = data[0];
				codes = [];
			}
		});
		readable.on('end', function() {
			//save the final set of codes for the last section
			sections.push({section:section_name,codes:codes});
			res.send(sections);
		})
	});

//////////////////////////////////
//below this obtains to information regarding API releases and API documentation
/////////////////////////////////

var sample_output = [
{
	"body": "",
    "headline": "S.KOREA SAYS SEPT EXPORTS -8.3 PCT VS YR EARLIER (REUTERS POLL -10.0 PCT)",
    "date": "2015-10-01T00:00:00.092Z",
    "tpc_list": [
      "KR",
      "EMRG",
      "ASIA",
      "MCE",
      "ECI",
      "NEWS1",
      "TRD",
      "LEN",
      "RTRS"
    ],
    "instr_list": [
      "KRW=",
      "0#KRCOMP1=KQ",
      "KREXGR=ECI",
      "KRIMGR=ECI",
      "KRTBAL=ECI"
    ]
}]
var code_sample = [
{
    "section": "Cross-market Codes",
    "codes": [
          {
                "code": "BACT",
                "name": "Business Activites",
                "description": ""
          },
          {
                "code": "DIARY",
                "name": "Diaries",
                "description": "All financial and general news diaries"
          }]
}]
router.route('/route_info')
	.get(function(req, res){
		var routes = [
		{
			name: '/tpc_list_full',
				request: 'GET',
				description: 'returns a full list of topics in reuter news with extra information',
				input: [],
				output_type: 'application/json',
				schema: [
			 		{name: 'section', description: '', type:'String'},
			 		{name: 'codes', description: 'A list of code objects (code, name, description)', type:'[Object]'},
			 		{name: 'code', description: 'The code identifier', type:'String'},
			 		{name: 'name', description: 'The full name of the topic code', type:'String'},
			 		{name: 'description', description: 'A description of the topic code', type:'String'}
				],
				output_example: JSON.stringify(code_sample,  null, "  ")
		},
		{
			name: '/news',
			request: 'GET',
			description: 'returns all news articles in the database in reverse chronological order',
			input: [],
			output_type: 'application/json',
			schema: [
		 		{name: 'date', description: 'Timestamp when the news was posted', type:'Date'},
		 		{name: 'headline', description: 'The news headline', type:'String'},
		 		{name: 'body', description: 'Contents of the news', type:'String'},
		 		{name: 'tpc_list', description: 'Topic codes associated with the news', type:'[String]'},
		 		{name: 'instr_list', description: 'Instrument codes associated with the news', type:'[String]'}
			],
			output_example: ''
		},
		{
			name: '/tpc_list',
			request: 'GET',
			description: 'returns a list of topic codes used in the database',
			input: [],
			output_type: 'application/json',
			schema: [],
			output_example: '["KR","EMRG","ASIA","MCE","ECI","NEWS1"]'
		},
		{
			name: '/instr_list',
			request: 'GET',
			description: 'returns a list of instrument codes used in the database',
			input: [],
			output_type: 'application/json',
			schema: [],
			output_example: '["KRW=","0#KRCOMP1=KQ","KREXGR=ECI","KRIMGR=ECI","KRTBAL=ECI","TPITWDOND="]'
		},
		{ name:'/newest',
		  request: 'POST',
		  description: 'receives a post request with input conditions and returns the specified news tuples sorted by reverse chronological order.',
		  input: 
		 	[
		 		{name: 'tpc_list', description: '(Optional) List of topics to search', type:'[String]'},
		 		{name: 'instr_list', description: '(Optional) List of instruments to search', type:'[String]'}
		 	],
		  output_type: 'application/json',
		  schema:
		 	[
		 		{name: 'date', description: 'Timestamp when the news was posted', type:'Date'},
		 		{name: 'headline', description: 'The news headline', type:'String'},
		 		{name: 'body', description: 'Contents of the news', type:'String'},
		 		{name: 'tpc_list', description: 'Topic codes associated with the news', type:'[String]'},
		 		{name: 'instr_list', description: 'Instrument codes associated with the news', type:'[String]'}
			],
		  output_example: sample_output
		},
		{name:'/query',
		 request: 'POST',
		 description: 'receives a post request with input conditions and returns the specified news tuples',
		 input: 
		 	[
		 		{name: 'start_date', description: 'Starting date to recieve news from', type:'Date'},
		 		{name: 'end_date', description: 'Ending date to recieve news from', type:'Date'},
		 		{name: 'tpc_list', description: '(Optional) List of topics to search', type:'[String]'},
		 		{name: 'instr_list', description: '(Optional) List of instruments to search', type:'[String]'}
		 	],
		 output_type: 'application/json',
		 schema:
		 	[
		 		{name: 'date', description: 'Timestamp when the news was posted', type:'Date'},
		 		{name: 'headline', description: 'The news headline', type:'String'},
		 		{name: 'body', description: 'Contents of the news', type:'String'},
		 		{name: 'tpc_list', description: 'Topic codes associated with the news', type:'[String]'},
		 		{name: 'instr_list', description: 'Instrument codes associated with the news', type:'[String]'}
			],
		  output_example: sample_output
		}
		]
		return res.json(routes);
	});

//any routes below this can be put inside appNg.js
router.route('/input')
	.get(function(req, res){
		var input = 
			{
				"start_date": "yyyy-MM-ddTHH:mm:ss.SSSZ",
				"end_date": "yyyy-MM-ddTHH:mm:ss.SSSZ",
				"tpc_list": "[]",
				"instr_list": "[]"
			}	
		return res.json(input);
	});
router.route('/inputExample')
	.get(function(req, res){
		var inputEg = 
			{
				"start_date": "2015-10-01T00:00:00.092Z",
				"end_date": "2015-10-01T00:15:00.000Z",
				"instr_list": ["KRW=","KREXGR=ECI"],
				"tpc_list": []
			}	
		return res.json(inputEg);
	});

module.exports = router;
