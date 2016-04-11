var app = angular.module('app', ['ngRoute', 'ngResource']);

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
		.when('/guide',{
			templateUrl: 'guide.html'
		})
});

app.controller('releasesController', function(){
	this.releases = info;
	
	this.cVersion = '1.1';
	this.selectRelease = function(version){
		this.cVersion = version;
	};
	this.isSelected = function(version){
		return this.cVersion === version;
	};
});

app.controller('guideController', function($scope, $http){
	this.cPage = 'intro';
	$http.get('api/input')
		.then(function(response){
			$scope.inputFormat = JSON.stringify(response.data, null, "  ");
		});
});

app.directive('schemaTable', function(){
	return {
		restrict: 'E',
		templateUrl: 'schemaTable.html'
	};
});
app.directive('inputTable', function(){
	return {
		restrict: 'E',
		templateUrl: 'inputTable.html'
	};
});

var info = [
	/*{
		version: '1.2',
		date: '',
		new_routes: [
            ],
		implemented: ['unreleased'],
		differences: []
	},*/
	{
		version: '1.1',
		date: '11/04/2016',
		new_routes: [
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
					]
				}
            ],
		implemented: ['Query for newest news'],
		differences: []
	},
	{
		version: '1.0',
		date: '6/04/2016',
		new_routes: 
			[
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
					]
				}
			],
		implemented: ['Database construction from news text file', 
					  'Query by date range',
					  'Query using topic and instrument codes',
					  'New API client to demonstrate uploading files',
					  'API guide to show usage of the API in an application'
					 ],
		differences: []
	
	}
]

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

app.controller('clientController', function ($scope, $http) {
	this.cTab = 'upload';
    this.showContent = function($fileContent){
        this.contents = $fileContent;
    };
    this.postContent = function(data){
    	var url = 'api/query';
    	//var url = 'http://localhost:3000/api/query'; //for local usage revert back to the above url when commiting
		$http.post(url, data, {headers: {'Content-Type': 'application/json'} })
			.then(function (response) {
				$scope.contents = JSON.stringify(response.data, null, "  ");
				$scope.error = null;
			},
			function(err) {
				$scope.contents = null;
    			$scope.error = ('ERR', err.data);
    		})	
    };
    this.postContent2 = function(data){
    	var url = 'api/query';
    	$scope.contents2 = null;
    	//var url = 'http://localhost:3000/api/query'; //for local usage revert back to the above url when commiting
		$http.post(url, data, {headers: {'Content-Type': 'application/json'} })
			.then(function (response) {
				$scope.contents2 = JSON.stringify(response.data, null, "  ");
				$scope.error2 = null;
			},
			function(err) {
				$scope.contents2 = null;
    			$scope.error2 = ('ERR', err.data);
    		})
    };
    this.clearText = function(){
    	$scope.inputExample = '';
    	console.log($scope.inputExample);
    }
    this.changeTab = function(tab){
    	this.cTab = tab;
    };
    this.isTab = function(tab){
    	return this.cTab === tab;
    };
    $http.get('api/inputExample')
		.then(function(response){
			$scope.inputExample = JSON.stringify(response.data, null, "  ");
		});
	$http.get('api/input')
		.then(function(response){
			$scope.inputFormat = JSON.stringify(response.data, null, "  ");
		});
	this.date_options = ['1', '2', '3', '4', '5'];
	this.codes = ['ABC', 'CNG', 'QWE'];
	this.curr_display_time = new Date().toISOString().slice(0,-1);
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
