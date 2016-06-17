# Angular Google API

This module helps working with Google APIs. The [Javascript client of Google](https://developers.google.com/api-client-library/javascript/start/start-js) must be loaded via HTTP and cannot be included in a Chrome Extension. Therefore you can use `$http` and build your requests by yourself. As common Google APIs are REST based JSON APIs this works very well. The angular-google-api module helps you with authorizing and building requests. 

## Quickstart

Add angular-google-api to your requirements. 

```
bower install --save angular-google-api
```

Add the googleApi angular module as a dependency.

```
var driveApp = angular.module('driveApp', ['googleApi']);
```

Add the googleApi to your controller.

```
driveApp.controller('DriveController', function($scope, $log, googleApi){});
```

Authorize

```
googleApi.authorize(true, function(){
	$log.info("authorized!")
	$scope.getDriveItems();
});
```

Use it.

```
googleApi.get("https://www.googleapis.com/drive/v3/files", {
	"orderBy": "name"
}).then(function(response){
	$log.info("drive items retrieved", response.data);
	$scope.driveItems = response.data;
}, function(error){
	$log.warn("failed to get google drive files", error);
})
```

### Optional

If you are using only one API, you can set the base URL for API requests. 

```
googleApi.baseUrl = "https://www.googleapis.com/drive/v3/";
```

# Examples

More examples can be found in the examples folder.

