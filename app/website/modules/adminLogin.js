var request = require('request');
var config = require('../../../conf.json');


module.exports = function(req, cb) {
    request.post({
            url: req.protocol + "://" + req.hostname + ":" + config.port + "/api/usuario/entrar/",
            form: {
                idAdmin: req.body.idUsuario
            }
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cb(null, body);
            } else {
                cb(true)
            }
        })
}
