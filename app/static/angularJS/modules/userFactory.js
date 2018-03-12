app.factory("User", function($http, $cookies) {
    var url         = "/api/usuario/"
    var urlLogin    = '/api/login/login';
    var urlSiginup  = '/api/login/siginup';
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
        }   
    //     correosNuevos: function(rfc, correo, idTipoCorreo) {
    //         console.log(rfc+ ' ' + correo+ ' ' + idTipoCorreo+ 'Factori')
    //         return $http.post(url + 'guardaCorreosNuevos/', {
    //             rfc: rfc,
    //             correo: correo,
    //             idTipoCorreo: idTipoCorreo
    //         });
    //     },
    //     eliminarCorreos: function(idUsuarioCorreo) {
    //         console.log(idUsuarioCorreo)
    //         return $http.post(url + 'eliminarCorreo/', {
    //             idUsuarioCorreo: idUsuarioCorreo
    //         });
    //     },
    //     update: function(razon, rfc, value, type) {
    //         return $http.post(url + 'editar/', {
    //             razon: razon,
    //             rfc: rfc,
    //             value: value,
    //             type: type
    //         });
    //     },//listaCorreos 
    //      getCombo: function() {
    //         return $http.get(url + 'comboTipoCorreos/');
    //     },
    //     getListMails: function(rfc) {
    //         console.log(rfc + ' factory')
    //         return $http.get(url + 'listaCorreos/', {
    //             params: {
    //                 rfc: rfc
    //             }
    //         });
    //     },
    //     logout: function() {
    //         return $http.post(url + 'salir/');
    //     },
        // me: function() {
        //     return $http.get(url + 'me/');
        // },
    //     reactivate: function(rfc) {
    //         return $http.post(url + 'reactivate/', {
    //             rfc: rfc
    //         });
    //     },
    //     saveToken: function(token) {
    //         $cookies.put('andrade-token-provider', token);
    //     },
    //     getToken: function() {
    //         return $cookies.get('andrade-token-provider')
    //     },
    //     validate: function(rfc, token, op) {
    //         return $http.post(url + 'validar/', {
    //             rfc: rfc,
    //             token: token,
    //             option: op
    //         });
    //     },
    //     activate: function(rfc, token, op) {
    //         return $http.post(url + 'activar/', {
    //             rfc: rfc,
    //             token: token,
    //             option: op
    //         });
    //     }
    }
});
