var request = require('request'),
    passport = require('passport'),
    dashboardView = require('../views/reference'),
    dashboardModel = require('../models/dataAccess'); //LQMA 23012018


//LQMA 16102017 WS node
var soap = require('soap');
var parseString = require('xml2js').parseString;


var dashboard = function (conf) {
    this.conf = conf || {};
    this.view = new dashboardView();
    this.model = new dashboardModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

/** Metodo para el traer las empresas visualizador
 * URL = '/api/dashboard/empresas'
  */
dashboard.prototype.get_empresas = function(req, res, next){
    
    var self    = this;
    var params = [];

    this.model.query('[dbo].[marcas_get_SP]', params, function(error, result) {
        // console.log('error', error)
        // console.log('result', result)

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });   

};

dashboard.prototype.get_pdfWSOrdenCompra = function(req, res, next) {
    
    var self = this;

    var url = this.conf.parameters.WSFactura;
    if (req.query.rfcEmisor && req.query.folio && req.query.serie) {
        
        var args = {
            RFCEMISOR:      req.query.rfcEmisor,
            RFCRECEPTOR:    req.query.rfcReceptor,
            SERIE:          req.query.serie,
            FOLIO:          req.query.folio
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
                client.MuestraFactura(args, function(err, result, raw) {
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
                                //console.log("RESULTADO", result["soap:Envelope"]["soap:Body"][0].MuestraFacturaResponse[0].MuestraFacturaResult[0].pdf);
                                
                                console.log("error", err);
                                var arrayBits = result["soap:Envelope"]["soap:Body"][0].MuestraFacturaResponse[0].MuestraFacturaResult[0].pdf; 
                                console.log( "arrayBits", arrayBits );
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
};

module.exports = dashboard;
