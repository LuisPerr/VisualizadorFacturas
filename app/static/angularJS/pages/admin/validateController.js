app.controller('validateController', function($scope, $state, $location, User, AlertFactory) {
    $scope.showBtn = 0;
    if ( $location.search().token ) {
        User.validarCuenta( $location.search().token ).then(function(response) {
            console.log( "response", response );
            var data = response.data[0]
            console.log( "dataVar", data );
            if ( data.success === 1 ) {
                $scope.showBtn = 1;
                console.log( "RFC", data.rfc );
                localStorage.setItem('rfcUser', data.rfc);
            //     User.activate($location.search().rfc, $location.search().token, $location.search().idOp).then(function(data) {
            //         data = data.data[0]
            //         if (data.estatus === "ok") {
            //             AlertFactory.success(data.mensaje)
            //             $state.go("login")
            //         } else {
            //             AlertFactory.error(data.mensaje)
            //         }
            //     })
            // } else {
            //     AlertFactory.error(data.mensaje)
            //     $("#activatingMsg").text(data.mensaje)
            }
        })
    } else {
        toastr.error(
            'Alto.', 
            'Necesita una clave de confirmación', 
            {timeOut: 2000}
        );
    }
})
