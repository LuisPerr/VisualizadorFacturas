app.controller('userController', function($scope, User, $state, AlertFactory) {
    $scope.currentPage = 0;
    $scope.itemsPerPage = 5;
$scope.lstCorreos = [];
    // User.me().then(function(user) {
    //     $scope.user = user.data
    //     console.log($scope.user.rfc)
    //     $scope.getListMails($scope.user.rfc)
    //     $scope.comboCorreo();

    // })
    $('#logoFile').change(function() {
        var formData = new FormData(document.getElementById("uploadLogo"));
        $.ajax({
            url: '/api/fileUpload/logo/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data) {
                data = data[0];
                if (data.estatus == "ok") {
                    AlertFactory.success(data.mensaje);
                } else {
                    AlertFactory.error(data.mensaje);
                }
            }
        });
    });
    $scope.updateEmail = function() {
        User.update($scope.user.razonSocial, $scope.user.rfc, $scope.newEmail, 1).then(function(data) {
            data = data.data[0]
            $scope.newEmail = "";
            if (data.estatus == "ok") {
                AlertFactory.success(data.mensaje);
            } else {
                AlertFactory.error(data.mensaje);
            }
        });
    }
    $scope.comboCorreo = function() {
        User.getCombo().then(function(data) {
            $scope.comboCorreo = data.data
            
             $scope.tipoCorreo = $scope.comboCorreo[0];
            console.log(data)
        });
    }
    $scope.deletedMail = function(id){
        User.eliminarCorreos(id).then(function(data) {
            $scope.getListMails($scope.user.rfc)
            if (data != null) {
                AlertFactory.success('Correo Eliminado');
            } else {
                AlertFactory.error('Correo  No Eliminado');
            }
        });
    }

    $scope.addMails = function(correo,tipoCorreo){
        console.log(correo)
        console.log(tipoCorreo.idtipoCorreo)
        console.log($scope.user.rfc)
        User.correosNuevos($scope.user.rfc, correo, tipoCorreo.idtipoCorreo).then(function(data) {
            console.log(data)
            data = data.data[0]
            if (data != null) {
                $scope.getListMails($scope.user.rfc)
                AlertFactory.success('Exito');
            } else {
                AlertFactory.error('Error');
            }
        });

    }
//

 $scope.getListMails = function(rfc) {
    $scope.lstCorreos = [];
        User.getListMails(rfc).then(function(data) {
            $scope.lstCorreos = data.data
            $scope.totalElements = $scope.lstCorreos.length;
            console.log('entro a función')
            console.log( data.data)
        });
    }

       $scope.changeMail = function(mail) {
        console.log(mail)
    }




    $scope.updatePassWord = function() {
        User.update($scope.user.razonSocial, $scope.user.rfc, $scope.pass, 2).then(function(data) {
            data = data.data[0]
            $scope.pass = $scope.passConfirm = "";
            if (data != null) {
                //$scope.getListMails($scope.user.rfc)
                AlertFactory.success('Se cambio la contraseña');
            } else {
                AlertFactory.error('no se pudo guardar');
            }
        });
    }

    $scope.salir = function() {
        User.logout().then(function() {
            $state.go("login")
        });
    }




        //Pagination
    $scope.range = function() {
        var rangeSize = 5;
        var ret = [];
        var start;
        if ($scope.currentPage - 2 >= 0) {
            start = $scope.currentPage - 2;
        } else {
            start = 0;
        }
        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }

        for (var i = start; i < start + rangeSize; i++) {
            if (i >= 0)
                ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.pageCount = function() {
        return Math.ceil($scope.totalElements / $scope.itemsPerPage) - 1;
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.setPage = function(n) {
        $scope.currentPage = n;
    };
})
