app.controller('searchController', function($scope, $rootScope ,$stateParams, $filter, User, Filtro) {

//Obtiene los proveedores LQMA add 19102017
    $scope.ShowSearchProveedor = function() {
        $('#searchProveedor').modal('show');
    };

    //Obtiene los proveedores LQMA add 19102017
    $scope.BuscarProveedor = function() {
        Filtro.getProveedor($scope.textProveedor)
            .success(getProveedorSuccessCallback)
            .error(errorCallBack);
    };

    var getProveedorSuccessCallback = function(data, status, headers, config) {
        $rootScope.listaProveedores = data;
        alertFactory.success('Se ha(n) encontrado ' + data.length + ' proveedor(es) que coniciden con la búsqueda.');
    };

    $scope.SetProveedor = function(pro) {
        $rootScope.proveedor = pro;
        $('#searchProveedor').modal('hide');
    };

    $scope.ClearProveedor = function() {
        $rootScope.proveedor = null;
    }

    var errorCallBack = function(data, status, headers, config) {
        $('#btnEnviar').button('reset');
        $('#btnBuscar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };
	
});