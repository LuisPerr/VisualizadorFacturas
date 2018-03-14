var request = require('request'),
    passport = require('passport'),
    loginView = require('../views/reference'),
    loginModel = require('../models/dataAccess'); 

var soap = require('soap');
var parseString = require('xml2js').parseString;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

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
    
    this.model.query('[dbo].[siginup_visualizador_SP]', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });   
};

/** Metodo para el envio de correo 
 * URL = '/api/login/sendmailing'
  */
 login.prototype.post_sendmailing = function(req, res, next){
     
    var email = req.body.email;
    var token = req.body.token;
       
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secureConnection: false,
        port: 587,
        requiresAuth: true,
        domains: ["gmail.com", "googlemail.com"],
        auth: {
            user: 'timbrado.andrade@gmail.com',
            pass: 'S1ST3M4S'
        }
    });
    
    var mailOptions = {
        from: '"Facturas" <grupoandrade.reportes@grupoandrade.com.mx>', // sender address 
        to: email, // list of receivers 
        subject: 'Verifique su cuenta', // Subject line 
        text: '', // plaintext body 
        html: `<table style="height: 401px; width: 100%;" border="0" width="826" cellspacing="0">
        <tbody>
            <tr style="height: 15px;" bgcolor="#f5f5f5">
                <td>&nbsp;</td>
                <tdstyle="width:600px">
                <td>&nbsp;</td>
            </tr>
            <tr bgcolor="#f5f5f5">
                <td>&nbsp;</td>
                <td bgcolor="#FCFAFB" style="width:600px"> &nbsp; </td>
                <td>&nbsp;</td>
            </tr>
            <tr bgcolor="#f5f5f5">
                <td>&nbsp;</td>
                <td bgcolor="#FCFAFB" style="width:600px">
                    <center><img id="headerImage" style="width: 280px;" src="http://inversorlatam.com/wp-content/uploads/2016/07/Logo-Grupo-Andrade-Completo.jpg" alt="" /></center>
                </td>
                <td>&nbsp;</td>
            </tr>
            <tr bgcolor="#f5f5f5">
                <td>&nbsp;</td>
                <td style="padding: 15px; width:600px" bgcolor="#FCFAFB">
                    <h1 style="font-size: 24px; font-family: 'Raleway', sans-serif; font-style: normal;"><span style="color: #333;">Bienvenid@</span></h1>
                    <!-- <h1 style="font-size: 24px; font-family: 'Raleway', sans-serif; font-style: normal;"><span style="color: #333;">{{ tem_asunto }}</span></h1> -->
                    <p style="font-size: 16px; line-height: 24px; font-family: 'Raleway', sans-serif; font-style: normal;"><span style="color: #333;">Hola, gracias por registrarte en el portal, para poder ingresar debes verificar tu cuenta.</p>
                    <!-- <p style="font-size: 16px; line-height: 24px; font-family: 'Raleway', sans-serif; font-style: normal;"><span style="color: #333;">{{ tem_mensaje }}</p> -->
                    <br />
                    <div style="font-size: 16px; line-height: 24px; font-family: 'Raleway', sans-serif; font-style: normal;"><span style="color: #333;">Puedes ingresar desde el siguiente bot&oacute;n:</span></div>
                    <br />
                    <center>
                        <br />
                        <div style="font-size: 12px;">
                            <div style="font-size: 18px;"><a class="btn-form" style="font-family: 'Raleway', sans-serif; width: 150px; background-color: #013064; border: solid 1px #013064; color: white !important; text-decoration: none !important; padding: 10px 30px;" href="http://192.168.20.99:3500/activacionCuenta?token=` + token + `">Verificar cuenta</a></div>
                            <br /><br /><br />
                        </div>
                       
                        <p style="font-size: 16px; line-height: 24px; font-family: 'Raleway', sans-serif; font-style: normal;"><span style="color: #333;">¿Problemas con el botón? <br /> Copia y pega el siguiente link: <br> http://192.168.20.99:3500/activacionCuenta?token=` + token + ` </p>
                    </center>
                </td>
                <td bgcolor="#f5f5f5">&nbsp;</td>
            </tr>
            <tr bgcolor="#f5f5f5">
                <td>&nbsp;</td>http://192.168.20.99:3500/
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>
            <tr bgcolor="#fff">
                <td>&nbsp;</td>
                <td>
                    <p style="font-size: 10px; font-family: tahoma; color: #999; padding: 15px;">&copy;2018 Todos los derechos reservados. <br /> Este e-mail fue enviado autom&aacute;ticamente, favor de no responderlo.</p>
                </td>
                <td>&nbsp;</td>
            </tr>
        </tbody>
    </table>`
    };
    
    transporter.sendMail(mailOptions, function(error, info) {

        if (error) {
            res.send(500);
            console.log("Error Send", error);
        } else {
            res.send(200);
            console.log('Message sent: ' + info.response);
        }      
    });

    transporter.close;
};

/** Metodo para verificar la cuenta del visualizador
 * URL = '/api/login/verificar'
*/
 login.prototype.post_verificar = function(req, res, next){
    console.log( "Verificar" );
    var self  = this;
    var token = req.body.token;

    var params = [                  
        { name: 'token', value: token, type: self.model.types.STRING },
    ];

    this.model.query('[dbo].[validarCuenta_visualizador_SP]', params, function(error, result) {
        console.log('error', error)
        console.log('result', result)

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });   

};

module.exports = login;