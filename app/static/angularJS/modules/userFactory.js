app.factory("User", function($http, $cookies) {
    var url             = "/api/usuario/"
    var urlLogin        = '/api/login/login';
    var urlSiginup      = '/api/login/siginup';
    var urlSendMail     = '/api/login/sendmailing';
    urlValidarCuenta    = '/api/login/verificar';
    return {
        login: function(rfc, pass) {
            return $http.get(urlLogin, {
                params:{
                    rfc: rfc,
                    pass: pass
                }
            });
        },
        signup: function(razon, email, rfc, pass, token, ) {
            return $http.post(urlSiginup, {
                razon: razon,
                email: email,
                rfc: rfc,
                pass: pass,
                token: token
            })
        },
        sendMail: function(email, token){
            return $http.post(urlSendMail, {
                email: email,
                token: token
            });
        },
        validarCuenta: function( token ){
            return $http.post(urlValidarCuenta,{
                token: token
            });
        }
    }
});
