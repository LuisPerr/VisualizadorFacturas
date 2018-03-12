app.factory("Order", function($http) {
    var url = "/api/orden/"
    return {
        getPendingByProvider: function(idProvider, rfc, idRol,idEmpresaP,idSucursalP,idDeptoP,fechaIniP,fechaFinP,rfcProveedor) {
            
            console.log('proveedor')
            return $http.get(url + 'pendientes/', {
                params: { //LQMA add 15092017 parametros para filtros: empresa, sucursal, departamento, fechaI, fechaF    
                    idProvider: idProvider,
                    rfc: rfc,
                    idRol,
                    idEmpresaP,
                    idSucursalP,
                    idDeptoP,
                    fechaIniP,
                    fechaFinP,
                    rfcProveedor
                }
            });
        },
        getEnterByProvider: function(idProvider, rfc, idRol,idEmpresaP,idSucursalP,idDeptoP,fechaIniP,fechaFinP,rfcProveedor) {
            return $http.get(url + 'ingresadas/' , {
                params: {
                    idProvider: idProvider,
                    rfc: rfc,
                    idRol,
                    idEmpresaP,
                    idSucursalP,
                    idDeptoP,
                    fechaIniP,
                    fechaFinP,
                    rfcProveedor
                }
            });
        },
        getPaidByProvider: function(idProvider, rfc, idRol,idEmpresaP,idSucursalP,idDeptoP,fechaIniP,fechaFinP,rfcProveedor) {
            return $http.get(url + 'pagadas/' , {
                params: {
                    idProvider: idProvider,
                    rfc: rfc,
                    idRol,
                    idEmpresaP,
                    idSucursalP,
                    idDeptoP,
                    fechaIniP,
                    fechaFinP,
                    rfcProveedor
                }
            });
        },
        pendingSeen: function(idOrder) {
            return $http.post(url + 'pendientevista/', {
                idOrder: idOrder
            });
        },
        getDocuments: function(idOrder) {
            return $http.get(url + 'documentos/' + idOrder, {
                idOrder: idOrder
            });
        },
         getEstatusFolio: function(folio) {
            return $http.get(url + 'estatusFolio/', {
                folio: folio
            });
        },//LQMA 16102017 WS node
        pdfWSOrdenCompra: function (tipo,folio,nodo,idProveedor) {
            return $http({
                url: url + 'pdfWSOrdenCompra/',
                method: "GET",
                params: {
                    tipo: tipo,
                    folio: folio,
                    nodo: nodo,
                    idProveedor: idProveedor
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },//LQMA 23012018 node, se agregaron columnas Factura, Ref. Bancaria, obtiene WS de comprobante pago
        pdfWSDocArray: function (tipo,folio,nodo) {
            return $http({
                url: url + 'pdfWSDocArray/',
                method: "GET",
                params: {
                    tipo: tipo,
                    folio: folio,
                    nodo: nodo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOPendientes: function(idProvider, rfc, idRol,idEmpresaP,idSucursalP,idDeptoP,fechaIniP,fechaFinP,rfcProveedor)            
        {
            return $http.get(url + 'OPendientes/', {
                params: { 
                            idProveedor: idProvider,
                            user: rfc,                    
                            idUserRol: idRol,
                            idEmpresaP: idEmpresaP,
                            idSucursalP: idSucursalP,
                            idDeptoP: idDeptoP,
                            fechaIniP: fechaIniP,
                            fechaFinP: fechaFinP,
                            rfcProveedor: rfcProveedor
                        }
            });
        },
        getOIngresadas: function(idProvider, rfc, idRol,idEmpresaP,idSucursalP,idDeptoP,fechaIniP,fechaFinP,rfcProveedor)            
        {
            return $http.get(url + 'OIngresadas/', {
                params: { 
                            idProveedor: idProvider,
                            user: rfc,                    
                            idUserRol: idRol,
                            idEmpresaP: idEmpresaP,
                            idSucursalP: idSucursalP,
                            idDeptoP: idDeptoP,
                            fechaIniP: fechaIniP,
                            fechaFinP: fechaFinP,
                            rfcProveedor: rfcProveedor
                        }
            });
        },
        getOPagadas: function(idProvider, rfc, idRol,idEmpresaP,idSucursalP,idDeptoP,fechaIniP,fechaFinP,rfcProveedor)            
        {
            return $http.get(url + 'OPagadas/', {
                params: { 
                            idProveedor: idProvider,
                            user: rfc,                    
                            idUserRol: idRol,
                            idEmpresaP: idEmpresaP,
                            idSucursalP: idSucursalP,
                            idDeptoP: idDeptoP,
                            fechaIniP: fechaIniP,
                            fechaFinP: fechaFinP,
                            rfcProveedor: rfcProveedor
                        }
            });
        }
    }
}).directive('noSpecialChar', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == null)
            return ''
          cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
          if (cleanInputValue != inputValue) {
            modelCtrl.$setViewValue(cleanInputValue);
            modelCtrl.$render();
          }
          return cleanInputValue;
        });
      }
    }
  });
