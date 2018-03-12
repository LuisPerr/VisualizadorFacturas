app.controller('validateController', function($scope, $state, $location, User, AlertFactory) {
    if ($location.search().token && $location.search().rfc && $location.search().idOp) {
        User.validate($location.search().rfc, $location.search().token, $location.search().idOp).then(function(data) {
            data = data.data[0]
            if (data.estatus === "ok") {
                User.activate($location.search().rfc, $location.search().token, $location.search().idOp).then(function(data) {
                    data = data.data[0]
                    if (data.estatus === "ok") {
                        AlertFactory.success(data.mensaje)
                        $state.go("login")
                    } else {
                        AlertFactory.error(data.mensaje)
                    }
                })
            } else {
                AlertFactory.error(data.mensaje)
                $("#activatingMsg").text(data.mensaje)
            }
        })
    } else {
        AlertFactory.error(data.mensaje)
        $("#activatingMsg").text(data.mensaje)
    }
})
