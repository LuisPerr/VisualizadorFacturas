app.controller('loginController', function($scope, $location, $state, User, AlertFactory, New) {
    $scope.rfc = ""
    $scope.pass = ""

    $scope.submit = function() {
        
        if( $scope.rfc == "" || $scope.pass == "" ){
            toastr.error(
                'Alto.', 
                'Ingresa los datos necesarios.', 
                {timeOut: 2000});
        }else{
            User.login($scope.rfc, $scope.pass).then(function(response) {
                if( response.status === 200 && response.data[0].success !== 0 ){
                    $state.go('admin.dashboard');
                    localStorage.setItem("userData", JSON.stringify(response.data));
                    localStorage.setItem("login", "true");
                }else{
                    toastr.error(
                        'Alto.', 
                        response.data[0].msg, 
                        {timeOut: 2000}
                    );
                }
            }, function(error) {
                $scope.pass = ''
                AlertFactory.error('RFC o contraseña incorrecta intenta de nuevo por favor.')
            });
        }
        // User.login($scope.rfc, $scope.pass).then(function(user) {
        //     if (user.data.token) {
        //         setToken(user.data.token)
        //     }
        // }, function(error) {
        //     $scope.pass = ""
        //     AlertFactory.error("RFC o contraseña incorrecta intenta de nuevo por favor.")
        // })
    }

    // if ($location.search().token) {
    //     setToken($location.search().token)
    // }

    // function setToken(token) {
    //     User.saveToken(token);
    //     New.getNews($scope.rfc).then(function(data) {
    //         $scope.listNews = data.data;
    //         var newFlag = false;
    //         for (var i in $scope.listNews) {
    //             if ($scope.listNews[i].idEstatus == 1) {
    //                 newFlag = true;
    //                 break;
    //             }
    //         }
    //         if (newFlag) {
    //             $state.go("admin.news");
    //         } else {
    //             $state.go("admin.pOrder");
    //         }

    //     })
    // }

});
