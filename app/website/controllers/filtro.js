var filtroView = require('../views/reference'),
    filtroModel = require('../models/dataAccess');

var path = require('path');
//var webPage = require('webpage');
var request = require('request');


var Filtro = function(conf) {
    console.log('conf: ')
    console.log(conf)    

    this.conf = conf || {};

    this.view = new filtroView();
    this.model = new filtroModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

Filtro.prototype.get_buscaProveedor = function(req, res, next) {

    var self = this;

    var params = [                  
                  { name: 'nombre_proveedor', value: req.query.proveedor, type: self.model.types.STRING }
    ];

    console.log('parametros: ',params)
    console.log('SEL_PROVEEDOR_BUSCA_SP')

    this.model.query('SEL_PROVEEDOR_BUSCA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = Filtro;