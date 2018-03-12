app.factory("Company", function($http) {
    var url = "/api/empresa/"
    return {
        getByProvider: function(idProvider, rfc,idRol) {
            return $http.get(url + 'list/', {
                params: {
                    idProvider: idProvider,
                    rfc: rfc,
                    idRol:idRol
                }
            });
        }
    }
});
