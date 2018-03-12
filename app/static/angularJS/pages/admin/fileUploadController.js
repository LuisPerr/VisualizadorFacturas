app.controller('fileUploadController', function($scope, File, Utils, Order, AlertFactory) {
    $scope.uploadButton = false;
    $scope.uploadButton2 = false;
    $scope.closeButton = false;
    $scope.loadingOrder = true;
    $scope.facturaSubida = false;
    $scope.init = function(){
        $scope.facturaSubida = false;   
    }
    // Habilita
    $('#collapseOne').on('show.bs.collapse', function() {
        $("#collapseTwo").collapse('hide')
        $("#collapsethree").collapse('hide')
    })

    // Habilita
    $('#collapseTwo').on('show.bs.collapse', function() {
        $("#collapseOne").collapse('hide')
        $("#collapsethree").collapse('hide')
    })

    // Habilita
    $('#collapsethree').on('show.bs.collapse', function() {
        $("#collapseOne").collapse('hide')
        $("#collapseTwo").collapse('hide')
    })

    // función para mostrar los documentos asociados al idOrden
    $('#fileModal').on('shown.bs.modal', function(e) {
        if(File.order.Recepcion == 'Recepción Completa' || File.order.Recepcion == 'Pendiente' ){
            $scope.facturaSubida = false;

        }else{
            if(File.order.Recepcion == 'Recepción Incompleta'){
                $scope.facturaSubida = true;
            }
        }
        $("#collapseOne").collapse('show')
        $("#collapseTwo").collapse('hide')
        $("#collapsethree").collapse('hide')
        $("#fileModalLabel").text("Orden " + File.order.folio)
        /*
        Order.getDocuments(File.order.folio).then(function(d) {
            if (d.data.arrayBits) {
                var pdf = URL.createObjectURL(Utils.b64toBlob(d.data[0].arrayB, "application/pdf"))
                $("<object id='pdfDisplay' data='" + pdf + "' width='100%' height='400px' >").appendTo('#pdfContent');
            } else {
                $("<h1>No hay orden de compra disponible</h1>").appendTo('#pdfContent');
            }
            $scope.loadingOrder = false;
        });
        */
        //'AU-ZM-NZA-SE-PE-7'
        Order.pdfWSOrdenCompra('OCO',File.order.folio,0,null).then(function(d) {
            console.log('WS node: ');
            console.log(d);

            if (d.data.arrayBits) {
                var pdf = URL.createObjectURL(Utils.b64toBlob(d.data.arrayBits, "application/pdf"))
                $("<object id='pdfDisplay' data='" + pdf + "' width='100%' height='400px' >").appendTo('#pdfContent');
            } else {
                $("<h1>No hay orden de compra disponible</h1>").appendTo('#pdfContent');
            }
            $scope.loadingOrder = false;

        });

    });


    // Función para subir los archivos de PDF y XML Facturas...
    var dropzone = new Dropzone("#fileUpload", {
        url: "api/fileUpload/files/",
        uploadMultiple: true,
        autoProcessQueue: false,
        maxFiles: 2,
        dictDefaultMessage: "Selecciona el XML y el PDF", //LQMA
        dictRemoveFile: "Cancelar",
        dictCancelUpload: "Cancelar subida",
        dictCancelUploadConfirmation: "Estas seguro de cancelar la subida de este archivo?",
        addRemoveLinks: true,
        acceptedFiles: "application/pdf,text/xml",

        init: function() {
            var self = this;
            this.on("addedfile", function(file) {
                if (self.files.length == 2) {
                    $scope.uploadButton = true;
                    //$scope.uploadButton2 = true;
                    $scope.$apply()
                } else if (self.files.length > 2) {
                    self.removeFile(file)
                }
            });
            this.on("removedfile", function(file) {
                if (self.files.length < 2) {
                    $scope.uploadButton = false;
                    //$scope.uploadButton2 = false;
                    $scope.$apply()
                }
            });
            this.on("successmultiple", function(event, res) {
                AlertFactory.info(res.msg[0] + res.msg[1]);
                $scope.uploadButton = false;
                //$scope.uploadButton2 = false;
                $scope.closeButton = true;
                $scope.$apply()
            });
            this.on("sending", function(file, xhr, formData) {
                formData.append("provider", File.order.provider);
                formData.append("rfc", File.order.rfc);
                formData.append("folio", File.order.folio);
                formData.append("idRol", File.order.idRol);
                formData.append("rfcProvider", File.order.rfcProvider);
                formData.append("tipoDocumento",1);
                //$scope.facturaSubida = true;
                

            })
        }
    });

    // Función para subir los archivos de PDF y XML Noas de Credito...
    var dropzones = new Dropzone("#fileUploads", {
        url: "api/fileUpload/files/",
        uploadMultiple: true,
        autoProcessQueue: false,
        maxFiles: 2,
        dictDefaultMessage: "Selecciona el XML y el PDF", //LQMA
        dictRemoveFile: "Cancelar",
        dictCancelUpload: "Cancelar subida",
        dictCancelUploadConfirmation: "Estas seguro de cancelar la subida de este archivo?",
        addRemoveLinks: true,
        acceptedFiles: "application/pdf,text/xml",

        init: function() {
            var self = this;
            this.on("addedfile", function(file) {
                if (self.files.length == 2) {
                    //$scope.uploadButton = true;
                    $scope.uploadButton2 = true;
                    $scope.$apply()
                } else if (self.files.length > 2) {
                    self.removeFile(file)
                }
            });
            this.on("removedfile", function(file) {
                if (self.files.length < 2) {
                    //$scope.uploadButton = false;
                    $scope.uploadButton2 = false;
                    $scope.$apply()
                }
            });
            this.on("successmultiple", function(event, res) {
                AlertFactory.info(res.msg[0] + res.msg[1]);
                //$scope.uploadButton = false;
                $scope.uploadButton2 = false;
                $scope.closeButtons = true;
                $scope.$apply()
            });
            this.on("sending", function(file, xhr, formData) {
                formData.append("provider", File.order.provider);
                formData.append("rfc", File.order.rfc);
                formData.append("folio", File.order.folio);
                formData.append("idRol", File.order.idRol);
                formData.append("rfcProvider", File.order.rfcProvider);
                formData.append("tipoDocumento",2);
                console.log("Notas de credito")


            })
        }
    });

    // Función para subir documento
    $scope.uploadInvoice = function() {
        dropzone.processQueue();
        //$scope.facturaSubida = true;
    }

     $scope.uploadInvoiceCred = function() {
        dropzones.processQueue();
        
    }
    // Acciones a hacer cuando se cierra la modal
    $('#fileModal').on('hidden.bs.modal', function(e) {
        $scope.uploadButton = false;
        $scope.uploadButton2 = false;
        $scope.closeButton = false;
        $scope.loadingOrder = true;
        $scope.facturaSubida = false;
        dropzone.removeAllFiles();
        dropzones.removeAllFiles();
        $("#pdfContent").empty();
    })
})
