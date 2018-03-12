var request = require('request'),
    passport = require('passport'),
    loginView = require('../views/reference'),
    loginModel = require('../models/dataAccess'); 

//LQMA 16102017 WS node
var soap = require('soap');
var parseString = require('xml2js').parseString;

var login = function (conf) {
    this.conf = conf || {};
    this.view = new loginView();
    this.model = new loginModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
}

/** Metodo para el login del visualizador
 * URL = '/api/login/login'
  */
login.prototype.get_login = function(req, res, next){
    
    var self    = this;
    var rfc     = req.query.rfc;
    var pass    = req.query.pass;

    var params = [                  
        { name: 'User', value: rfc, type: self.model.types.STRING },
        { name: 'Pass', value: pass, type: self.model.types.STRING },
    ];

    this.model.query('[dbo].[login_visualizador_SP]', params, function(error, result) {
        console.log('error', error)
        console.log('result', result)

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });   

};

/** Metodo para el siginup del visualizador
 * URL = '/api/login/siginup'
  */
login.prototype.post_siginup = function(req, res, next){
    var self    = this;
    var razon   = req.body.razon;
    var rfc     = req.body.rfc;
    var email   = req.body.email;
    var pass    = req.body.pass;
    var token   = req.body.token;
    
    var params = [                  
        { name: 'usu_razonSocial',  value: razon, type: self.model.types.STRING },
        { name: 'usu_rfc',          value: rfc, type: self.model.types.STRING },
        { name: 'cor_correo',       value: email, type: self.model.types.STRING },
        { name: 'cor_pass',         value: pass, type: self.model.types.STRING },
        { name: 'usu_token',        value: token, type: self.model.types.STRING },
    ];
    console.log( "Params", params );
    this.model.query('[dbo].[siginup_visualizador_SP]', params, function(error, result) {
        console.log('error', error)
        console.log('result', result)

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });   
};

module.exports = login;