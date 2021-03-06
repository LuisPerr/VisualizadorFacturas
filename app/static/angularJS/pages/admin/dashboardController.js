app.controller('dashboardController', function($scope, $location, $state, User, AlertFactory, New, Dashboard, Utils) {
    $scope.Init = function(){
        var loggin = localStorage.getItem("login");
        
        $scope.marcas = [];
        $scope.inputSerie = "";
        $scope.inputFolio = "";
        $scope.selectedEmpresa = 0; 

        if( loggin === null ){
            $state.go('login');
        }else{
            console.log('Bienvenido');
            $scope.getMarcas = function() {
                Dashboard.getMarcas().then(function(response) {
                    $scope.marcas = response.data;
                    console.log( 'Marcas', $scope.marcas );
                }, function(error) {
                    AlertFactory.error('Error al traer las empresas.');
                });
            };

            $scope.submit = function () {
                
                Dashboard.pdfWSOrdenCompra("AVI140211LX5", 'X', $scope.inputSerie, $scope.inputFolio).then(function (d) {
                    console.log('WS node: ');
                    console.log(d);

                    if (d.data.arrayBits) {
                        var pdf = URL.createObjectURL(Utils.b64toBlob(d.data.arrayBits, "application/pdf"))
                        $("<object id='pdfDisplay' data='" + pdf + "' width='100%' height='400px' >").appendTo('#pdfContent');
                    } else {
                        $("<h1>No hay orden de compra disponible</h1>").appendTo('#pdfContent');
                    }
                    $scope.loadingOrder = false;

                });
            };
            
            $scope.getMarcas();
        }
    }
});
