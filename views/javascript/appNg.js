var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'main.html' 
		})
		.when('/releases', {
			templateUrl: 'releases.html' 
		})
		.when('/client',{
			templateUrl: 'client.html'
		})
});

app.controller('releasesController', function(){
	this.releases = info;
	
	this.cVersion = '1.0';
	this.selectRelease = function(version){
		this.cVersion = version;
	};
	this.isSelected = function(version){
		return this.cVersion === version;
	};
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
			 }
			],
		implemented: ['Database construction from news text file', 
					  'Query by date range',
					  'Query using topic and instrument codes',
					 ],
		differences: []
	
	},
	{
		version: '1.1',
		date: '',
		new_routes: [],
		implemented: ['unreleased'],
		differences: []
	}]

	/*
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
	*/

//for the api client

app.controller('clientController', function () {
	this.cTab = 'default';
    this.showContent = function($fileContent){
        this.content = $fileContent;
    };
    this.changeTab = function(tab){
    	this.cTab = tab;
    };
    this.isTab = function(tab){
    	return this.cTab === tab;
    };
  });

app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();
                
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});
