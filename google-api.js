var googleApi = angular.module('googleApi', []);

googleApi.factory('googleApi', function($http, $log) {
  this.accessToken = false;
  this.isAuthorized = false;
  this.baseUrl = "";

  this.authorize = function(options) {
    // this only works in background, not in the content script
    // try {
    //   chrome.identity.getAuthToken({interactive: interactive}, function(token) {
    //     if (token) {
    //       this.accessToken = token;
    //       this.isAuthorized = true;
    //       if(typeof(opt_callback) == 'function'){
    //         opt_callback();
    //       }
    //     }
    //   }.bind(this));
    // } catch(e) {
    //   $log.error(e);
    // }
    if(options === undefined){
      options = {};
    }
    this.port = chrome.runtime.connect({name: options.port || "googleApi"});
    this.port.onMessage.addListener(function(msg) {
      switch (msg.type){
        case "token":
            // $log.info("got token", msg);
            this.isAuthorized = msg.authorized;
            if(msg.authorized){
              this.setToken(msg.accessToken);
            }
            if(options.callback){
              options.callback(msg.authorized, msg.accessToken);
            }
          break;
      }
    }.bind(this));
     this.port.postMessage({type: "getToken", interactive: options.interactive === true ? true : false});
  }.bind(this);
  
  this.setToken = function(token){
    this.accessToken = token;
    this.isAuthorized = true;
  }.bind(this);
  
  this.formatDate = function(date){
    var offset = date.getTimezoneOffset();
    var pad = function(num) {
      var norm = Math.abs(Math.floor(num));
      return (norm < 10 ? '0' : '') + norm;
    };
    
   /* return date.getFullYear() 
        + '-' + pad(date.getMonth()+1)
        + '-' + pad(date.getDate())
        + 'T' + pad(date.getHours())
        + ':' + pad(date.getMinutes()) 
        + ':' + pad(date.getSeconds())  +
      (offset < 0 ? '-' : '+') + 
      pad(offset / 60)+
      ':' + pad(offset % 60);*/
      return date.toISOString();
  }.bind(this);
  
  this.guid = function(){
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }.bind(this);
  
  this.request = function(method, url, params, data, headers){
    
    if(!this.isAuthorized){
     /* this.authorize(false,function(){
        this.request(method, url, data, headers, callback);
      }.bind(this));*/
      return;
    }
    
    if(typeof(data) == 'undefined'){
      data = {};
    }
    if (typeof(headers) == 'undefined'){
      headers = {};
    }
    if (typeof(method) == 'undefined' || method === ''){
      method = 'GET';
    }
    
    if (typeof(params) == 'undefined'){
      params = {};
    }
    
    params['alt'] = 'json';
    
    headers['Authorization'] = 'Bearer ' + this.accessToken;
    //headers['Content-Type'] = 'application/json';
    
    $log.info("About to do http request");
    var config = {
      method: method,
      url: this.baseUrl + url,
      params: params,
      headers: headers,
      data: data
    };
    $log.info(config);
    
    return $http(config);
  }.bind(this);
  
  this.get = function(url, params, headers){
    return this.request('GET', url, params, {}, headers);
  }.bind(this);
  
  this.post = function(url, params, data, headers){
    return this.request('POST', url, params, data, headers);
  }.bind(this);

  this.put = function(url, params, data, headers){
    return this.request('PUT', url, params, data, headers);
  }.bind(this);

  this.patch = function(url, params, data, headers){
    return this.request('PATCH', url, params, data, headers);
  }.bind(this);
  
  this.delete = function(url, params, data, headers){
    return this.request('DELETE', url, params, data, headers);
  }.bind(this);
  
  return this;
});
