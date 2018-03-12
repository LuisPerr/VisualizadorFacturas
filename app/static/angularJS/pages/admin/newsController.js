app.controller('newsController', function($scope, New, User) {

    $scope.time = new Date();
    $scope.user;
    User.me().then(function(user) {
        $scope.user = user.data;
        New.getNews($scope.user.ppro_idUserRol==1 ?$scope.user.rfc : $scope.user.ppro_userId).then(function(data) {
            $scope.listNews = data.data;
        })
    })

    $scope.newSeen = function(idNew, rfc) {
        New.setSeen(idNew, rfc).then(function(data) {
        })
    }


})
