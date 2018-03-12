var env = process.env.NODE_ENV || 'production',
    express = require('express'),
    swig = require('swig'),
    middlewares = require('./middlewares/admin'),
    router = require('./website/router');


//Alta de opciones
var done = false;

var ExpressServer = function(config) {
    new require('./website/modules/auth')(config)
    this.config = config || {};
    this.expressServer = express();

    // middlewares
    for (var middleware in middlewares) {
        this.expressServer.use(middlewares[middleware]);
    }
    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/website/views/templates');
    swig.setDefaults({
        varControls: ['[[', ']]']
    });

    //////////////////////////////////////////////////////////////

    if (env == 'development') {
        console.log('OK NO HAY CACHE');
        this.expressServer.set('view cache', false);
        swig.setDefaults({
            cache: false,
            varControls: ['[[', ']]']
        });
    }

    for (var controller in router) {
        var middles = new router[controller](this.config).middlewares || [];
        for (var funcionalidad in router[controller].prototype) {
            var method = funcionalidad.split('_')[0];
            var entorno = funcionalidad.split('_')[1];
            var data = funcionalidad.split('_')[2];
            data = (method == 'get' && data !== undefined) ? ':data' : '';
            var url = '/api/' + controller + '/' + entorno + '/' + data;
            this.router(controller, funcionalidad, method, url, middles);
        }
    }
    //Servimos el archivo angular
    this.expressServer.get('*', function(req, res) {
        res.sendfile('app/static/index.html');
    });
    this.expressServer.post('*', function(req, res) {
        require('./website/modules/adminLogin')(req, function(error, token) {
            if (error) return res.redirect("/");
            res.redirect("/?token=" + JSON.parse(token).token)
        })

    });
};

ExpressServer.prototype.router = function(controller, funcionalidad, method, url, middles) {
    console.log(url);
    var parameters = this.config.parameters;
    this.expressServer[method](url, middles, function(req, res, next) {
        var conf = {
            'funcionalidad': funcionalidad,
            'req': req,
            'res': res,
            'next': next,
            'parameters': parameters
        }
        var Controller = new router[controller](conf);
        Controller.response();
    });
}
module.exports = ExpressServer;
