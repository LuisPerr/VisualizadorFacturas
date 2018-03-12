var request = require('request'),
    passport = require('passport'),
    ocView = require('../views/reference'),
    ordenModel = require('../models/dataAccess'); //LQMA 23012018


//LQMA 16102017 WS node
var soap = require('soap');
var parseString = require('xml2js').parseString;


var Orden = function(conf) {
    this.conf = conf || {};
    this.view = new ocView();

    //LQMA 23012018
    this.model = new ordenModel({
        parameters: this.conf.parameters
    });

    if (conf) {
        this.url = this.conf.parameters.server + "cargaapi/"
    }
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
    this.middlewares = [
        passport.authenticate('bearer', {
            session: false
        })
    ]
}

Orden.prototype.get_pendientes = function(req, res, next) { //LQMA add 15092017 parametros para filtros: empresa, sucursal, departamento, fechaI, fechaF    

    console.log(req.query)

    if (req.query.idProvider && req.query.rfc && req.query.idRol && req.query.idEmpresaP && req.query.idSucursalP && req.query.idDeptoP && req.query.fechaIniP != undefined && req.query.fechaFinP != undefined && req.query.rfcProveedor != undefined) {
        request(this.url + "1|" + req.query.idProvider + "|" + req.query.rfc + "|" + req.query.idRol + "|" + req.query.idEmpresaP + "|" + req.query.idSucursalP + "|" + req.query.idDeptoP + "|" + req.query.fechaIniP + "|" +req.query.fechaFinP+ "|" +req.query.rfcProveedor,
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    } else {
        console.log(req.query)        
        res.json([]);
    }
}

Orden.prototype.get_ingresadas = function(req, res, next) {

    if (req.query.idProvider && req.query.rfc && req.query.idRol && req.query.idEmpresaP && req.query.idSucursalP && req.query.idDeptoP && req.query.fechaIniP != undefined && req.query.fechaFinP != undefined && req.query.rfcProveedor != undefined) {
        
        console.log(this.url+ "2|" + req.query.idProvider + "|" + req.query.rfc + "|" + req.query.idRol  + "|" + req.query.idEmpresaP + "|" + req.query.idSucursalP + "|" + req.query.idDeptoP + "|" + req.query.fechaIniP + "|" +req.query.fechaFinP+ "|" +req.query.rfcProveedor)
        request(this.url + "2|" + req.query.idProvider + "|" + req.query.rfc + "|" + req.query.idRol  + "|" + req.query.idEmpresaP + "|" + req.query.idSucursalP + "|" + req.query.idDeptoP + "|" + req.query.fechaIniP + "|" +req.query.fechaFinP+ "|" +req.query.rfcProveedor,
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    } else {
        res.json([]);
    }
}
Orden.prototype.get_pagadas = function(req, res, next) {
    if (req.query.idProvider && req.query.rfc && req.query.idRol && req.query.idEmpresaP && req.query.idSucursalP && req.query.idDeptoP && req.query.fechaIniP != undefined && req.query.fechaFinP != undefined && req.query.rfcProveedor != undefined) {
        request(this.url + "4|" + req.query.idProvider + "|" + req.query.rfc + "|" + req.query.idRol   + "|" + req.query.idEmpresaP + "|" + req.query.idSucursalP + "|" + req.query.idDeptoP + "|" + req.query.fechaIniP + "|" +req.query.fechaFinP+ "|" +req.query.rfcProveedor,
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    } else {
        res.json([]);
    }
}
Orden.prototype.post_pendientevista = function(req, res, next) {
    if (req.body.idOrder) {
        request.post({
            url: this.conf.parameters.server + "consultaapi/1",
            form: JSON.stringify({
                idOrder: req.body.idOrder
            })
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
        })
    } else {
        res.json([]);
    }
}

Orden.prototype.get_documentos_data = function(req, res, next) {
    if (req.params.data) {
        request.get(this.conf.parameters.server + "consultaapi/7|" + req.params.data + "|0",
            function(error, response, body) {
                if (!error && response.statusCode == 200) {

                    res.json(JSON.parse(body));
                }
            })
    } else {
        res.json({})
    }
}

Orden.prototype.get_estatusFolio = function(req, res, next) {
    if (req.params.folio) {
        request.get(this.conf.parameters.server + "consultaapi/8|" + req.params.folio + "|",
            function(error, response, body) {
                if (!error && response.statusCode == 200) {

                    res.json(JSON.parse(body));
                }
            })
    } else {
        res.json({})
    }
}

//LQMA 23012018
Orden.prototype.get_OPendientes = function(req, res, next){

    var self = this;
    
    var params = [                  
                  { name: 'idProveedor', value: req.query.idProveedor, type: self.model.types.INT },
                  { name: 'monto', value: null, type: self.model.types.INT },
                  { name: 'orden', value: null, type: self.model.types.INT },
                  { name: 'user', value: req.query.user, type: self.model.types.STRING },
                  { name: 'idUserRol', value: req.query.idUserRol, type: self.model.types.INT },
                  { name: 'idEmpresaP', value: req.query.idEmpresaP, type: self.model.types.INT },
                  { name: 'idSucursalP', value: req.query.idSucursalP, type: self.model.types.INT },
                  { name: 'idDeptoP', value: req.query.idDeptoP, type: self.model.types.INT },
                  { name: 'fechaIniP', value: req.query.fechaIniP, type: self.model.types.STRING },
                  { name: 'fechaFinP', value: req.query.fechaFinP, type: self.model.types.STRING },
                  { name: 'rfcProveedor', value: req.query.rfcProveedor, type: self.model.types.STRING }
    ];

    console.log('parametros: ',params)
    console.log('PPROV_ordcompra_prov')

    this.model.query('PPROV_ordcompra_prov', params, function(error, result) {
        console.log('error: ' + error)
        console.log('result: ' + result)

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });   

}

Orden.prototype.get_OIngresadas = function(req, res, next){

    var self = this;
    
    var params = [                  
                  { name: 'idProveedor', value: req.query.idProveedor, type: self.model.types.INT },
                  { name: 'monto', value: null, type: self.model.types.INT },
                  { name: 'orden', value: null, type: self.model.types.INT },
                  { name: 'user', value: req.query.user, type: self.model.types.STRING },
                  { name: 'idUserRol', value: req.query.idUserRol, type: self.model.types.INT },
                  { name: 'idEmpresaP', value: req.query.idEmpresaP, type: self.model.types.INT },
                  { name: 'idSucursalP', value: req.query.idSucursalP, type: self.model.types.INT },
                  { name: 'idDeptoP', value: req.query.idDeptoP, type: self.model.types.INT },
                  { name: 'fechaIniP', value: req.query.fechaIniP, type: self.model.types.STRING },
                  { name: 'fechaFinP', value: req.query.fechaFinP, type: self.model.types.STRING },
                  { name: 'rfcProveedor', value: req.query.rfcProveedor, type: self.model.types.STRING }
    ];

    console.log('parametros: ',params)
    console.log('PPROV_ORDCOMPRA_VALIDADAS')

    this.model.query('PPROV_ORDCOMPRA_VALIDADAS', params, function(error, result) {
        console.log('error: ' + error)
        console.log('result: ' + result)

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });   

}

Orden.prototype.get_OPagadas = function(req, res, next){

    var self = this;
    
    var params = [                  
                  { name: 'idProveedor', value: req.query.idProveedor, type: self.model.types.INT },
                  { name: 'monto', value: null, type: self.model.types.INT },
                  { name: 'orden', value: null, type: self.model.types.INT },
                  { name: 'user', value: req.query.user, type: self.model.types.STRING },
                  { name: 'idUserRol', value: req.query.idUserRol, type: self.model.types.INT },
                  { name: 'idEmpresaP', value: req.query.idEmpresaP, type: self.model.types.INT },
                  { name: 'idSucursalP', value: req.query.idSucursalP, type: self.model.types.INT },
                  { name: 'idDeptoP', value: req.query.idDeptoP, type: self.model.types.INT },
                  { name: 'fechaIniP', value: req.query.fechaIniP, type: self.model.types.STRING },
                  { name: 'fechaFinP', value: req.query.fechaFinP, type: self.model.types.STRING },
                  { name: 'rfcProveedor', value: req.query.rfcProveedor, type: self.model.types.STRING }
    ];

    console.log('parametros: ',params)
    console.log('PPROV_ORDCOMPRA_PAGADAS')

    this.model.query('PPROV_ORDCOMPRA_PAGADAS', params, function(error, result) {
        console.log('error: ' + error)
        console.log('result: ' + result)

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });   

}

Orden.prototype.get_pdfWSOrdenCompra = function(req, res, next) {
    var self = this;

    console.log(req.query.tipo, req.query.folio, req.query.nodo)

    var url = this.conf.parameters.WSOrdenCompra;
    if (req.query.tipo && req.query.folio && req.query.nodo) {
        var args = {
            Tipo: req.query.tipo,
            Documento: req.query.folio,
            Nodo: req.query.nodo,
            idProveedor: req.query.idProveedor
        };
        soap.createClient(url, function(err, client) {
            console.log(url)
            if (err) {
                console.log('Error 4', err)

                self.view.expositor(res, {
                    mensaje: "Hubo un problema intente de nuevo",
                });
            } else {
                console.log(args)
                client.GenerarPdf(args, function(err, result, raw) {
                    if (err) {
                        console.log('Error 3', err)

                        self.view.expositor(res, {
                            mensaje: "Hubo un problema intente de nuevo",
                        });
                    } else {
                        parseString(raw, function(err, result) {
                            if (err) {
                                console.log('Error 2', err)

                                self.view.expositor(res, {
                                    mensaje: "Hubo un problema intente de nuevo",
                                });
                            } else {
                                console.log('Llegue hasta el final')

                                console.log(result)
                                /console.log(result["soap:Envelope"]["soap:Body"][0]["GenerarPdfResponse"][0]["GenerarPdfResult"][0], 'Lo logre?')
                                var arrayBits = result["soap:Envelope"]["soap:Body"][0]["GenerarPdfResponse"][0]["GenerarPdfResult"][0]; 
                                self.view.expositor(res, {
                                    //mensaje: mensaje,
                                    result: {
                                        arrayBits: arrayBits
                                    }
                                });
                            }
                        });
                    }

                });
            }
        });
    } else {
        console.log('Error 1')
        self.view.expositor(res, {
            mensaje: "Hubo un problema intente de nuevo",
        });
    }
}

Orden.prototype.get_pdfWSDocArray = function(req, res, next) {
    
    var self = this;
    console.log('hi');
    console.log(req.query.tipo, req.query.folio, req.query.nodo)

    var url = this.conf.parameters.WSOrdenCompra;

    if (req.query.tipo && req.query.folio && req.query.nodo) {
        var args = {
            Tipo: req.query.tipo,
            Documento: req.query.folio,
            Nodo: req.query.nodo
        };
        soap.createClient(url, function(err, client) {
            console.log(url)
            if (err) {
                console.log('Error 4', err)

                self.view.expositor(res, {
                    mensaje: "Hubo un problema intente de nuevo",
                });
            } else {
                console.log(args)
                client.GenerarPdfArray(args, function(err, result, raw) {
                    if (err) {
                        console.log('Error 3', err)

                        self.view.expositor(res, {
                            mensaje: "Hubo un problema intente de nuevo",
                        });
                    } else {
                        parseString(raw, function(err, result) {
                            if (err) {
                                console.log('Error 2', err)

                                self.view.expositor(res, {
                                    mensaje: "Hubo un problema intente de nuevo",
                                });
                            } else {
                                console.log('Llegue hasta el final');
                                console.log(result["soap:Envelope"]["soap:Body"][0]["GenerarPdfArrayResponse"][0]["GenerarPdfArrayResult"][0], 'Lo logre?')
                                var arrayBits = result["soap:Envelope"]["soap:Body"][0]["GenerarPdfArrayResponse"][0]["GenerarPdfArrayResult"][0];
                                self.view.expositor(res, {
                                   result: {
                                        arrayBits: arrayBits
                                    }
                                });
                            }
                        });
                    }

                });
            }
        });
    } else {
        console.log('Error 1')
        self.view.expositor(res, {
            mensaje: "Hubo un problema intente de nuevo",
        });
    }
}

module.exports = Orden;
