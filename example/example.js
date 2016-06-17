var driveApp = angular.module('driveApp', ['googleApi']);

driveApp.controller('CalController', function($scope, $log, googleApi){

	var DRIVEAPI = "https://www.googleapis.com/drive/v3/";
	var authorized = false;
	$scope.driveItems = {};

	$scope.getDriveItems = function(){
		if(authorized){
			googleApi.get(DRIVEAPI + "files", {
				"orderBy": "name"
			}).then(function(response){
				$log.info("drive items retrieved", response.data);
				$scope.driveItems = response.data;
			}, function(error){
				$log.warn("failed to get google drive files", error);
			})
		}else {
			googleApi.authorize(true, function(){
				$log.info("authorized!")
				$scope.getDriveItems();
			});
		}
	}
}