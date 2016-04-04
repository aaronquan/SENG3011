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
	this.release = info;
});

var info = {version: '1.0',
	date: '5/04/2016',
	new_features: 
	    {new_commands: 
	    	[{name:'/query',
	    	 description: 'receives a post request with conditions and returns the specified news tuples.',
	    	 output_type: 'application/json',
	    	 schema: []},
			 {name: '/news',
			 description: 'returns the full database of news',
			 output_type: 'application/json',
	    	 schema: []}
	    	]
	    },
	comments: ['Adds and parses news file source into our MongoDB database into appropriate fields']
	}

