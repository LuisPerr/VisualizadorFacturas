app.factory("Filtro", function($http) {
    var url = "/api/filtro/"
    return {
    	getProveedor: function(proveedor) {            
            
            return $http.get(url + 'buscaProveedor/', {
                params: { //LQMA add 15092017 parametros para filtros: empresa, sucursal, departamento, fechaI, fechaF    
                    proveedor: proveedor
                }
            });
        }
	}
});