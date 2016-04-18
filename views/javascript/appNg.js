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
	
	this.cVersion = '1.2';
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

var info = [
	/*{
		version: '2.0',
		date: '',
		new_routes: [

            ],
		implemented: ['unreleased'],
		differences: []
	},*/
	{
		version: '1.2',
		date: '18/04/2016',
		new_routes: [
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
				}
            ],
		implemented: ['New data routes added for convenience'],
		differences: [
		 				'/api/query now searches for one or more codes in the given list'
		 			 ]
	},
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
					],
				  output_example: JSON.stringify(sample_output,  null, "  ")
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
					],
				  output_example: JSON.stringify(sample_output,  null, "  ")
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
	this.cTab = 'gui';
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
	});

app.controller('codeController', function($scope, $http){
	$scope.codeData = {
		tpc:
		{
			title:'Select Topic Codes:',
			allCodes: [],
			searchCodes: [],
			currentCodes: [],
			textSelected: false,
			searchFor: ''
		},
		instr:
		{
			title:'Select Instrument Codes:',
			allCodes: [],
			searchCodes: [],
			currentCodes: [], 
			textSelected: false,
			searchFor: ''
		}
	}
	//this.curr_display_time = new Date().toISOString().slice(0,-1);
	$scope.start_date = new Date().toISOString().slice(0,-1);
	$scope.end_date = new Date().toISOString().slice(0,-1);
	this.postQueryGUI = function(){
		console.log('clicked');
		var url = 'api/query';
		var data = {
			start_date: $scope.start_date,
			end_date: $scope.end_date,
			tpc_list: $scope.codeData['tpc']['currentCodes'],
			instr_list: $scope.codeData['instr']['currentCodes']
		};
		$http.post(url, data, {headers: {'Content-Type': 'application/json'} })
			.then(function (response) {
				$scope.contentsFromGUI = JSON.stringify(response.data, null, "  ");
				console.log(response.data);
				$scope.error = null;
			},
			function(err) {
				$scope.contentsFromGUI = null;
    			$scope.error = ('ERR', err.data);
    		});
	};
	$http.get('api/tpc_list')
		.then(function(response){
			$scope.codeData['tpc']['allCodes'] = response.data;
			$scope.codeData['tpc']['searchCodes'] = response.data;
			$scope.codeData['tpc']['currentCodes'] = [];
		});
	$http.get('api/instr_list')
		.then(function(response){
			$scope.codeData['instr']['allCodes'] = response.data;
			$scope.codeData['instr']['searchCodes'] = response.data;
			$scope.codeData['instr']['currentCodes'] = [];
		});
	this.search = function(string, list){
		string = string.toUpperCase();
		$scope.codeData[list]['searchCodes'] = [];
		if (string == ''){
			$scope.codeData[list]['searchCodes'] = $scope.codeData[list]['allCodes'];
			return;
		}
		for(var i in $scope.codeData[list]['allCodes']){
			if($scope.codeData[list]['allCodes'][i].indexOf(string) != -1){
				$scope.codeData[list]['searchCodes'].push($scope.codeData[list]['allCodes'][i]);
			}
		}
	}
	this.addCode = function(code, list){
		if($scope.codeData[list]['currentCodes'].indexOf(code) == -1)
			$scope.codeData[list]['currentCodes'].push(code);
	}
	this.removeCode = function(code, list){
		for(var i = $scope.codeData[list]['currentCodes'].length - 1; i >= 0; i--) {
			if($scope.codeData[list]['currentCodes'][i] === code) {
				$scope.codeData[list]['currentCodes'].splice(i, 1);
				break;
			}
		}
	}
	this.setSelected = function(bool, list){
		if (list == 'instr'){
			$scope.codeData['instr']['textSelected'] = bool;
			$scope.codeData['tpc']['textSelected'] = false;
		}
		if (list == 'tpc'){
			$scope.codeData['tpc']['textSelected'] = bool;
			$scope.codeData['instr']['textSelected'] = false;
		}	
	}
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

app.factory('clickAnywhereButHereService', function($document){
  var tracker = [];

  return function($scope, expr) {
    var i, t, len;
    for(i = 0, len = tracker.length; i < len; i++) {
      t = tracker[i];
      if(t.expr === expr && t.scope === $scope) {
        return t;    
      }
    }
    var handler = function() {
      $scope.$apply(expr);
    };

    $document.on('click', handler);

    // IMPORTANT! Tear down this event handler when the scope is destroyed.
    $scope.$on('$destroy', function(){
      $document.off('click', handler);
    });

    t = { scope: $scope, expr: expr };
    tracker.push(t);
    return t;
  };
});
app.directive('clickAnywhereButHere', function($document, clickAnywhereButHereService){
  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      var handler = function(e) {
        e.stopPropagation();
      };
      elem.on('click', handler);

      scope.$on('$destroy', function(){
        elem.off('click', handler);
      });

      clickAnywhereButHereService(scope, attr.clickAnywhereButHere);
    }
  };
});
