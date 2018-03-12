app.factory("Branch", function($http) {
    var url = "/api/sucursal/"
    return {
        getByCompany: function(idCompany, rfc,idRol,idProveedor) {
            return $http.get(url + 'list/', {
                params: {
                    idCompany: idCompany,
                    rfc: rfc,
                    idRol:idRol,
                    idProveedor:idProveedor
                }
            });
        },//LQMA 15092017 add obtiene departamentos
        getDeptos: function(idSucursal, idUsuario) {
            return $http.get(url + 'deptos/', {
                params: {
                    idSucursal: idSucursal,
                    idUsuario: idUsuario
                }
            });
        }
    }
});
