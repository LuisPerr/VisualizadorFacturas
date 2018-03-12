app.factory('oauthHttpInterceptor', function($cookies) {
    return {
        request: function(config) {
            if ($cookies.get('andrade-token-provider')){
              config.headers.Authorization = 'Bearer ' + $cookies.get('andrade-token-provider');
            }
            return config;
        }
    };
});

app.config(function($httpProvider) {
    $httpProvider.interceptors.push('oauthHttpInterceptor');
});
