var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'main.html' 
		})
		.when('/releases', {
			templateUrl: 'releases.html',
			controller: 'releasesController' 
		})
});

app.controller('releasesController', function(){
	this.releases = info;
	this.cVersion = '1.0';
});

var info = [
	{
		version: '1.0',
		date: '6/04/2016',
		new_routes: 
			[{name:'/query',
			 description: 'receives a post request with conditions and returns the specified news tuples',
			 output_type: 'application/json',
			 schema:
			 	[
			 		'date: timestamp when the news was posted - Date',
			 		'headline: the news headline - String',
			 		'body: contents of the news - String',
			 		'tpc_list: topic codes associated with the news - [String]',
			 		'instr_list: instrument codes associated with the news - [String]'
				]
			 },
			 {name: '/news',
			 description: 'returns the full database of news',
			 output_type: 'application/json',
			 schema: []
			 },
			 {name: '/source',
			  description: 'displays the text file from where the database was created from',
			  output_type: 'text/html',
			  schema: []
			 }
			],
		implemented: ['Database construction from news text file', 
					  'Query by date range',
					  'Query using topic and instrument codes',
					 ],
		differences: []
		/*
	},
	{
		version: '1.1',
		date: '',
		implemented: ['unreleased']
		*/
	}]

