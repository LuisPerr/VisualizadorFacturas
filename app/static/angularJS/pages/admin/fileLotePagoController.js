app.controller('fileLotePagoController', function($scope, File, Utils, Order) {

    $scope.loadingOrder = true;
    $('#fileLotePagoModal').on('shown.bs.modal', function(e) {
        $("#fileLotePagoLabel").text("Lote de Pago " + File.order.folio )
        
        Order.pdfWSOrdenCompra('LOT',File.order.folio,14,File.order.idProveedor).then(function(d) {
        //Order.pdfWSOrdenCompra('LOT','AU-AZ-ZAR-SE-PE-100',14).then(function(d) {   
        
            $("#pdfLotePagoContent").empty(); 
            
            if (d.data.arrayBits) {
                var pdf = URL.createObjectURL(Utils.b64toBlob(d.data.arrayBits, "application/pdf"))
                $("<object id='pdfDisplay' data='" + pdf + "' width='100%' height='400px' >").appendTo('#pdfLotePagoContent');
            } else {
                $("<h1>No hay Reporte de Lote disponible</h1>").appendTo('#pdfContent');
            }
            $scope.loadingOrder = false;

        });
        
    })
    $scope.uploadButton = false;
    $scope.closeButton = false;


    $scope.uploadInvoice = function() {
        dropzone.processQueue();
    }

    $('#fileLotePagoModal').on('hidden.bs.modal', function(e) {
        $scope.loadingOrder = true;
        $(".filesUpdate").remove();

    })
	
	
	$scope.getFileUrl = function(path) {
        var newPath = path.split('\\');
        var webPath = "";

        for (var i = 0; i < newPath.length; i++) {
            if (i > 0) webPath += '/' + newPath[i];
        }

        var pro = window.location.protocol;
        var srv = window.location.hostname;
        var valor = path.substring(3);
        var url = pro + '//' + srv + webPath;

        return url;

    };
	
})