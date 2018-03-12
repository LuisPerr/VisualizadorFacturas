app.controller('activatePendingController', function($scope, $state, $location, User, AlertFactory) {

    $scope.reactivateAcount = function() {
        User.me().then(function(user) {
            User.reactivate(user.data.rfc).then(function(data) {
                //data = data[0];
                if (data.data[0].estatus == "ok") {
                    AlertFactory.success(data.data[0].mensaje);
                } else {
                    AlertFactory.error(data.data[0].mensaje);
                }
            })
        })
    }

})
