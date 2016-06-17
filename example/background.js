chrome.runtime.onConnect.addListener(function(port) {
  if (port.name == "googleApi") {
    port.onMessage.addListener(function(msg) {
      if (msg.type == "getToken") {
        console.log("got token request", msg);
        chrome.identity.getAuthToken({
          interactive: msg.interactive ? true : false
        }, function(token) {
          port.postMessage({
            type: 'token',
            authorized: (typeof(token) !== undefined && token !== '' ? true : false),
            accessToken: token
          });
        });
      }
    });
  }
});