app.controller('signupController', function ($scope, User, AlertFactory, $state) {
    $scope.checkboxModel = {
        aviso: false
    };
    $scope.razon = '';
    $scope.email = '';
    $scope.rfc = '';
    $scope.pass = '';
    $scope.passConfirm = '';
    $scope.sendEmail = '';
    $scope.sendToken = '';

    $scope.signup = function () {
        
        if ($scope.checkboxModel.aviso) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            var hour = today.getHours();
            var minute = today.getMinutes();
            var second = today.getSeconds();
            var milisecond = today.getMilliseconds();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }
            $scope.today = mm + dd + yyyy + hour + minute + second;

            User.signup($scope.razon, $scope.email, $scope.rfc.toUpperCase(), $scope.pass, $scope.today)
                .then(function (response) {
                    if (response.data[0].success === 1) {
                        toastr.success(
                            'Listo.',
                            response.data[0].msg,
                            { timeOut: 2000 }
                        );
                        $state.go('login');
                    } else {
                        toastr.error(
                            'Alto.',
                            response.data[0].msg,
                            { timeOut: 2000 }
                        );
                    }
                    $scope.sendMail(response.data[0].correo, response.data[0].token);
                    console.log("response", response);
                },
                function (err) {
                    console.log(err)
                });
        }else{
            toastr.warning(
                'Alto.',
                'Debes aceptar el aviso de privacidad.',
                { timeOut: 2000 }
            );
        }

    };

    $scope.sendMail = function (email, token) {
        User.sendMail(email, token)
            .then(function (responseMail) {
                console.log("responseMail", responseMail);
            },
                function (err) {
                    console.log(err)
                })
    }

    var password = document.getElementById("pass"),
        confirm_password = document.getElementById("passConfirm");
    //document.getElementById("checkAviso").setCustomValidity("Selecciona para aceptar terminos y condiciones")

    $scope.submit = function () {
        if (password.value.length < 6) {
            password.setCustomValidity("La contraseña debe contener al menos 6 caracteres");
        } else {
            password.setCustomValidity('');
        }
        if (confirm_password.value.length < 6) {
            confirm_password.setCustomValidity("La contraseña debe contener al menos 6 caracteres");
        } else {
            confirm_password.setCustomValidity('');
        }
        if (password.value != confirm_password.value) {
            confirm_password.setCustomValidity("La contraseña no coincide");
        } else {
            confirm_password.setCustomValidity('');
            $scope.signup();
        }
    };
    // password.onchange = validatePassword;
    // confirm_password.onkeyup = validatePassword;
    // $('.i-checks').iCheck({
    //     checkboxClass: 'icheckbox_square-green',
    //     radioClass: 'iradio_square-green',
    // });


});
