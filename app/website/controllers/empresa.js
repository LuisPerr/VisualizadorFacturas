var request = require('request');

var Empresa = function(conf) {
    this.conf = conf || {};
    if (conf) {
        this.url = this.conf.parameters.server + "cargaapi/"
    }
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

Empresa.prototype.get_list = function(req, res, next) {
    console.log('get_list')
    console.log(req.query)

    if (req.query.idProvider && req.query.rfc && req.query.idRol) {
        request(this.url + "5|" + req.query.idProvider + "|" + req.query.rfc + "|" + req.query.idRol,
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    } else {
        res.json({});
    }
}

module.exports = Empresa;
