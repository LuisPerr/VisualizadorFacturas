var request = require('request');
var passport = require('passport');
var Auth = require('../modules/auth');


var User = function(conf) {
    this.conf = conf || {};
    if (conf) {
        this.url = this.conf.parameters.server + "loginapi/"
    }
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}


User.prototype.post_entrar = function(req, res, next) {
    var self = this;
    if (req.body.rfc && req.body.pass || req.body.idAdmin) {
      req.body.idAdmin = req.body.idAdmin || "";
        request.get(this.url + "1|" + req.body.rfc + "|" + req.body.pass + "|" + req.body.idAdmin, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                if (!body.length > 0) return res.status(401).send("No autorizado");
                auth = new Auth(self.conf);
                body[0].correo = decodeURIComponent(body[0].correo)
                auth.saveUser(body[0], function(err, token) {
                    if (err) return err;
                    res.json({
                        token: token
                    });
                })
            } else {
                return res.status(401).send("No autorizado");
            }
        })
    } else {
        return res.status(401).send("No autorizado");
    }
}

User.prototype.post_salir = function(req, res, next) {
    var self = this;
    auth = new Auth(self.conf);
    auth.getUser(req, res, next, function(error, user) {
        if (error) {
            return res.json({
                response: "ok"
            })
        }
        auth.removeUser(user, function(err, data) {
            if (err) {
                return res.json({
                    response: "error"
                })
            } else {
                return res.json({
                    response: "ok"
                })
            }
        })
    })
}

User.prototype.post_registrar = function(req, res, next) {
    var self = this;
    if (req.body.razon && req.body.email && req.body.rfc && req.body.pass) {
        request.post({
                url: this.url + "1",
                form: JSON.stringify({
                    razon: req.body.razon,
                    rfc: req.body.rfc,
                    email: req.body.email,
                    password: req.body.pass
                })
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));

                } else {
                    res.json({});
                }
            })
    }
}

User.prototype.post_editar = function(req, res, next) {
    var self = this;
    if (req.body.razon && req.body.rfc && req.body.value && req.body.type) {
        request.post({
                url: this.url + "2",
                form: JSON.stringify({
                    razon: req.body.razon,
                    rfc: req.body.rfc,
                    email: req.body.value,
                    password: req.body.value,
                    type: req.body.type
                })
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    }
}



User.prototype.post_guardaCorreosNuevos = function(req, res, next) {
    var self = this;
    console.log(req.body.rfc+' '+ req.body.correo+' '+ req.body.idTipoCorreo)
    //if (req.body.rfc && req.body.correo && req.body.idTipoCorreo) {
        console.log('entroServer')
        request.post({
                url: this.url + "6",
                form: JSON.stringify({
                    ppro_user: req.body.rfc,
                    correo: req.body.correo,
                    idTipoCorreo: req.body.idTipoCorreo
                })
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    //}console.log('No    entroServer')
}

User.prototype.post_eliminarCorreo = function(req, res, next) {
    var self = this;
    console.log(req.body.idUsuarioCorreo)
    //if (req.body.rfc && req.body.correo && req.body.idTipoCorreo) {
        console.log('entroServer')
        request.post({
                url: this.url + "8",
                form: JSON.stringify({
                    ppro_user: req.body.idUsuarioCorreo
                })
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    //}console.log('No    entroServer')
}


User.prototype.get_comboTipoCorreos = function(req, res, next) {
    //var self = this;
    //if (req.body.ppro_user && req.body.correo && req.body.idTipoCorreo) {
        request(this.url + "3|", function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
   // }
}

User.prototype.get_listaCorreos = function(req, res, next) {
    //var self = this;
     if (req.query.rfc){ 
        console.log(req.query.rfc )
        request(this.url + "4|" + req.query.rfc , function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            })
    }
    else{
        res.json([]);
    }
}


User.prototype.get_me = function(req, res, next) {
    var self = this;
    auth = new Auth(self.conf);
    auth.getUser(req, res, next, function(error, user) {
        if (error) return res.status(401).send("No autorizado");
        if (error) return res.json({});
        delete user.token;
        res.json(user);
    })
}

User.prototype.post_reactivate = function(req, res, next) {
    var self = this;
    if (req.body.rfc) {
        request.post({
                url: this.url + "5",
                form: JSON.stringify({
                    rfc: req.body.rfc,
                })
            },
            function(error, response, body) {
                body = JSON.parse(body);
                res.json(body);
            })
    } else {
        res.json({
            estatus: "error",
            mensaje: "Parametros incorrectos"
        });

    }
}

User.prototype.post_validar = function(req, res, next) {
    var self = this;
    if (req.body.rfc && req.body.token && req.body.option) {
        request.post({
                url: this.url + "3",
                form: JSON.stringify({
                    token: req.body.token,
                    rfc: req.body.rfc,
                    opcion: req.body.option
                })
            },
            function(error, response, body) {
                body = JSON.parse(body);
                res.json(body);
            })
    } else {
        res.json({
            estatus: "error",
            mensaje: "Parametros incorrectos"
        });

    }
}

User.prototype.post_activar = function(req, res, next) {
    var self = this;
    if (req.body.token && req.body.rfc && req.body.option) {
        request.post({
                url: this.url + "4",
                form: JSON.stringify({
                    token: req.body.token,
                    rfc: req.body.rfc,
                    opcion: req.body.option
                })
            },
            function(error, response, body) {
                body = JSON.parse(body);
                res.json(body);
            })
    } else {
        res.json({
            estatus: "error",
            mensaje: "Parametros incorrectos"
        });
    }
}

module.exports = User;
