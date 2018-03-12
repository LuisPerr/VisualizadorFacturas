app.factory("Dashboard", function($http, $cookies) {
    var urlGetEmpresas  = '/api/dashboard/empresas';
    var urlPdfFactura   = '/api/dashboard/pdfWSOrdenCompra';
    return {
        getMarcas: function() {
            return $http.get(urlGetEmpresas);
        },
        pdfWSOrdenCompra: function (rfcEmisor, rfcReceptor, serie, folio) {
            return $http({
                url: urlPdfFactura,
                method: "GET",
                params: {
                    rfcEmisor: rfcEmisor,
                    rfcReceptor: rfcReceptor,
                    serie: serie,
                    folio: folio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
});
