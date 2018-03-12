app.controller('fileUpdateController', function($scope, File, Utils, Order,AlertFactory) {

    $scope.loadingOrder = true;
    $('#collapseOneUpdate').on('show.bs.collapse', function() {
        $("#collapseTwoUpdate").collapse('hide')
        $("#collapsethreeupdate").collapse('hide')

    })
    $('#collapseTwoUpdate').on('show.bs.collapse', function() {
        $("#collapseOneUpdate").collapse('hide')
        $("#collapsethreeupdate").collapse('hide')
    })

     $('#collapsethreeupdate').on('show.bs.collapse', function() {
        $("#collapseOneUpdate").collapse('hide')
        $("#collapseTwoUpdate").collapse('hide')
    })

    $('#fileUpdateModal').on('shown.bs.modal', function(e) {
        if(File.order.Recepcion == 'Recepción Completa' || File.order.Recepcion == 'Pendiente' ){
            $scope.facturaSubidaUpdate = false;

        }else{
            if(File.order.Recepcion == 'Recepción Incompleta'){
                $scope.facturaSubidaUpdate = true;
            }
        }
        $("#collapseOneUpdate").collapse('show')
        $("#collapseTwoUpdate").collapse('hide')
        $("#collapsethreeupdate").collapse('hide')
        $scope.idEstatus = File.order.idEstatus;
        $("#fileModalUpdateLabel").text("Orden  " + File.order.folio)
        Order.getDocuments(File.order.folio).then(function(d) {
            console.log(d)
			
			var pdfFactPath = $scope.getFileUrl(d.data[0].pathPDF);
			
            var pdf = URL.createObjectURL(Utils.b64toBlob(d.data[0].arrayB, "application/pdf"))
            $("<object class='filesUpdate' data='" + pdf + "' width='100%' height='400px' >").appendTo('#pdfUpdateContent');
            if (d.data[0].pathXML != null)
                $('#xmlInvoceContent').text(d.data[0].pathXML);
            if (d.data[0].pathPDF != null)
                $("<object class='filesUpdate' data='" + pdfFactPath + "' width='100%' height='400px' >").appendTo('#pdfInvoceContent');
            if (d.data[0].pathXML != null)
                
                $('#xmlNotaCreditoInvoceContent').text(d.data[0].pathXML);
                if (d.data[0].pathPDF != null)
                $("<object class='filesUpdate' data='" + d.data[0].pathPDF + "' width='100%' height='400px' >").appendTo('#pdfNotaCreditoInvoceContent');


            $scope.loadingOrder = false;
        });
    })
    $scope.uploadButton = false;
    $scope.closeButton = false;

    var dropzone = new Dropzone("#fileUploadUpdate", {
        url: "api/fileUpload/filepdf/", //LQMA 19072017 cambio, nuevo servicio
        uploadMultiple: true,
        autoProcessQueue: false,
        maxFiles: 2,//maxFiles: 2,
        dictDefaultMessage: "Selecciona el PDF y/o XML", //LQMA 18072017
        dictRemoveFile: "Cancelar",
        dictCancelUpload: "Cancelar subida",
        dictCancelUploadConfirmation: "Estas seguro de cancelar la subida de este archivo?",
        addRemoveLinks: true,
        acceptedFiles: "application/pdf,text/xml", //acceptedFiles: "application/pdf,text/xml",

        init: function() {
            var self = this;
            this.on("addedfile", function(file) {
                if (self.files.length == 1 || self.files.length == 2) {  //if (self.files.length == 2) {
                    
                    $scope.aplicar = true;

                      if(self.files.length == 2)
                      {
                            //console.log(self.files[1].type)
                            //console.log(self.files[0].type)

                            if(self.files[1].type == self.files[0].type){
                                AlertFactory.info('No puede subir 2 archivos del mismo tipo, XML/PDF');
                                $scope.aplicar = false;
                            }                                       
                      }

                      if(self.files.length == 1){
                            //console.log('== 1');
                            console.log(self.files.length);                            

                            if(self.files[0].type == "text/xml") {

                                    //AlertFactory.info('No puede subir solo el XML. Debe subir XML y PDF.');
                                    $scope.aplicar = false;                                
                            }
                        }

                    $scope.uploadButton = $scope.aplicar;

                    $scope.$apply()                    
                    
                } else if (self.files.length > 2) { //} else if (self.files.length > 2) {
                    self.removeFile(file)
                }
            });
            this.on("removedfile", function(file) {

                if (self.files.length < 1) { //if (self.files.length < 2) {
                    $scope.uploadButton = false;                 
                }

                if (self.files.length == 1) { //if (self.files.length < 2) {
                    if(self.files[0].type == "text/xml"){
                                AlertFactory.info('No puede subir solo el XML. Debe subir XML y PDF.');                                
                                $scope.uploadButton = false; 
                            }
                            else
                                $scope.uploadButton = true;        
                }
                   $scope.$apply()
            });
            this.on("successmultiple", function(event, res) {
                AlertFactory.info(res.msg);
                $scope.uploadButton = false;
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

            })
        }
    });

    var dropzones = new Dropzone("#fileUploadUpdates", {
        url: "api/fileUpload/files/",
        uploadMultiple: true,
        autoProcessQueue: false,
        maxFiles: 2,
        dictDefaultMessage: "Selecciona el XML y el PDF",
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

    $scope.uploadInvoice = function() {
        dropzone.processQueue();
    }
    $scope.uploadInvoiceCredUpd = function() {
        dropzones.processQueue();
        
    }
    $('#fileUpdateModal').on('hidden.bs.modal', function(e) {
        $scope.loadingOrder = true;
        $scope.uploadButton = false;
        $scope.closeButton = false;
        dropzone.removeAllFiles();
        $(".filesUpdate").remove();

    })
	
	$scope.getFileUrl = function(path) {		
		var newPath = path.split('\\');
		var webPath ="";
		
		for (var i = 0; i < newPath.length; i++) {
			if(i>0) webPath +=  '/' + newPath[i] ;
		};
				
        var pro = window.location.protocol;
        var srv = window.location.hostname;
		var valor =path.substring(3);		
        var url = pro + '//' + srv +  webPath; 
		
        return url;
		
    };
})


//5579 0700 5568 1855
