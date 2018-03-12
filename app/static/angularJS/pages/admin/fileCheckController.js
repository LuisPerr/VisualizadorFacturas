app.controller('fileCheckController', function($scope, File, Utils, Order) {

    $scope.loadingOrder = true;
    $('#fileCheckModal').on('shown.bs.modal', function(e) {
        $("#fileModalCheckLabel").text("Orden  " + File.order.folio)
        Order.getDocuments(File.order.folio).then(function(d) {
			console.log('fileCheckController');     
            console.log(d.data);       

            if(d.data[0].pathPDF != null && d.data[0].pathPDF != undefined)
            {
    			var pdfFactPath = $scope.getFileUrl(d.data[0].pathPDF);
                var pdf = URL.createObjectURL(Utils.b64toBlob(d.data[0].arrayB, "application/pdf"))
                $("<object class='filesUpdate' data='" + pdf + "' width='100%' height='400px' >").appendTo('#pdfCheckContent');
                if (d.data[0].pathXML != null)
                    $('#xmlInvoceCheckContent').text(d.data[0].pathXML);;
                if (d.data[0].pathPDF != null)
                    $("<object class='filesUpdate' data='" + pdfFactPath + "' width='100%' height='400px' >").appendTo('#pdfInvoceCheckContent');
            }
            //var pdfPago = URL.createObjectURL(Utils.b64toBlob(d.data[0].z_arrayCompPag, "application/pdf"))
            //$("<object class='filesUpdate' data='" + pdfPago + "' width='100%' height='400px' >").appendTo('#pdfComprobantePago');
            //LQMA 03102017 add comprobante pago
            
            //LQMA add 23012018
            //$scope.setComprobantePago(d.data[0].r_pathCompPag,d.data[0].r_arrayCompPag)
            //$scope.setComprobantePago('AU-ZM-NZA-OT-PE-381');//File.order.folio)
            $scope.setComprobantePago('AA000002860/1/3');//File.order.folio)
            
            $scope.loadingOrder = false;
        });
    })
    $scope.uploadButton = false;
    $scope.closeButton = false;


    $scope.uploadInvoice = function() {
        dropzone.processQueue();
    }

    $('#fileCheckModal').on('hidden.bs.modal', function(e) {
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

    //LQMA 03102017 add funcion pinta comprobante pago
    //LQMA 23012018 changed
    $scope.setComprobantePago = function(folio){//function(path, ws){
        
        /*
        if(path != undefined && path != null)
            $("<object class='filesUpdate' data='" + path + "' width='100%' height='400px' >").appendTo('#pdfComprobantePago');
        
        angular.forEach(ws, function(value, key) {
                
                $("<li><a data-toggle='tab' href='#comppag"+ key +"'>Comprobante de pago Banco " + (key + 1) + "</a></li>").appendTo('#tabsDoctos');
                $("<div id='comppag"+ key +"' class='tab-pane'><div class='panel-body'><div id='pdfComprobantePago"+ key +"'></div></div></div>").appendTo('#tabsContenido');    

                var docWS = URL.createObjectURL(Utils.b64toBlob(value, "application/pdf"))

                $("<object class='filesUpdate' data='" + docWS + "' width='100%' height='400px'>").appendTo('#pdfComprobantePago'+ key);
        }); 
       */

       Order.pdfWSDocArray('REC',folio,0).then(function(d) { //PAC
            console.log('pdfWSDocArray')
            console.log(d.data.arrayBits);
            if (d.data.arrayBits) {
              
              var arregloBytes = d.data.arrayBits.base64Binary;
              /*  
              var pdf = URL.createObjectURL(utils.b64toBlob(arregloBytes, "application/pdf"))
                            var pdf_link = pdf;
                            var typeAplication = $rootScope.obtieneTypeAplication(pdf_link);
                            var titulo ='Factura  ::' + doc.factura;
                            var iframe = '<div id="hideFullContent"><div onclick="nodisponible()" ng-controller="documentoController"> </div> <object id="ifDocument" data="' + pdf + '" type="' + typeAplication + '" width="100%" height="100%"><p>Alternative text - include a link <a href="' + pdf + '">to the PDF!</a></p></object> </div>';
                            $.createModal({
                                title: titulo,
                                message: iframe,
                                closeButton: false,
                                scrollable: false
                            });
                     });

                */
                if(arregloBytes.length > 1)
                {
                    $("<ul class='nav nav-tabs' id='tabsDoctosPagos'></ul>").appendTo('#pdfComprobantePago');
                    $("<div class='tab-content' id='tabsContenidoPago'></div>").appendTo('#pdfComprobantePago');

                    angular.forEach(arregloBytes, function(value, key) {

                        $("<li><a data-toggle='tab' href='#comppag"+ key +"'>Comprobante de pago Banco " + (key + 1) + "</a></li>").appendTo('#tabsDoctosPagos');
                        $("<div id='comppag"+ key +"' class='tab-pane'><div class='panel-body'><div id='pdfComprobantePagoX"+ key +"'></div></div></div>").appendTo('#tabsContenidoPago');

                        var docWS = URL.createObjectURL(Utils.b64toBlob(value, "application/pdf"))
                        $("<object class='filesUpdate' data='" + docWS + "' width='100%' height='400px'>").appendTo('#pdfComprobantePagoX'+ key);
                        
                    });

                }
                else
                {
                    var pdf = URL.createObjectURL(Utils.b64toBlob(arregloBytes[0], "application/pdf"));    
                    //var pdf = URL.createObjectURL(Utils.b64toBlob(d.data.arrayBits[0], "application/pdf"))
                    $("<object id='pdfDisplay' data='" + pdf + "' width='100%' height='400px' >").appendTo('#pdfComprobantePago');
                }
                
            } else {
                $("<h1>No existe comprobante de pago.</h1>").appendTo('#pdfComprobantePago');
            }
            $scope.loadingOrder = false;

        });
    }
	
})
