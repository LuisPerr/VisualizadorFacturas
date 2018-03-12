var request = require('request');

var Sucursal = function(conf) {
    this.conf = conf || {};
    if (conf) {
        this.url = this.conf.parameters.server + "cargaapi/"
    }
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

Sucursal.prototype.get_list = function(req, res, next) {
    if (req.query.idCompany && req.query.rfc && req.query.idRol && req.query.idProveedor) {
        request(this.url + "6|" + req.query.idCompany + "|" + req.query.rfc
        + "|" + req.query.idRol+ "|" + req.query.idProveedor,
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    } else {
        res.json([]);
    }
}
//LQMA 15092017 add obtiene departamentos
Sucursal.prototype.get_deptos = function(req, res, next) {
    if (req.query.idSucursal && req.query.idUsuario) {
        request(this.url + "8|" + req.query.idSucursal + "|" + req.query.idUsuario,
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    } else {
        res.json([]);
    }
}

module.exports = Sucursal;
