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
	date: 'when',
	decription: 'hi'
	}
