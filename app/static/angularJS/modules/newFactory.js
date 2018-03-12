app.factory("New", function($http) {
    var url = "/api/noticia/"
    return {
        getNews: function(rfc) {
            return $http.get(url + 'list/' + rfc);
        },
        setSeen: function(idNew,rfc) {
            return $http.post(url + 'vista/', {
                idNew: idNew,
                rfc:rfc
            });
        }
    }
});
