var request = require('request');
var multer = require('multer')
var uuid = require('uuid');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'app/static/files/')
    },
    filename: function(req, file, cb) {
        cb(null, uuid.v4() + "." + file.mimetype.substring(file.mimetype.indexOf("/") + 1))
    }
})

var upload = multer({
    storage: storage
});


var FileUpload = function(conf) {
    this.conf = conf || {};
    if (conf) {
        //this.url = this.conf.parameters.server + "cargaapi/"
		console.log('OK');
    }
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
    this.middlewares = [
        upload.array('file[]')
    ]
}

FileUpload.prototype.post_files = function(req, res, next) {
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
	
	var currentUrl =  getDotNetApi(req);
	 console.log(currentUrl + '1');

    if (req.files.length == 2) {
        if (req.files[0].mimetype != "application/pdf") {
            var temp = req.files[0];
            req.files[0] = req.files[1]
            req.files[1] = temp;
        }
        var msg = [];
        for (var i in req.files) {
            request.post({
                url: currentUrl + "1",
                form: JSON.stringify({
                    dir: "files",
                    folio: req.body.folio[i],
                    proveedor: req.body.provider[i],
                    rfc: req.body.rfc[i],
                    tipo: req.files[i].mimetype.substring(req.files[i].mimetype.indexOf("/") + 1),
                    nombre: req.files[i].filename,
                    idRol: req.body.idRol[i],
                    rfcProviderOC: req.body.rfcProvider[i],
                    tipoDocumento: req.body.tipoDocumento[i]
                })
            }, function(err, httpResponse, body) {
                msg.push(body)
                console.log(body)
                if (msg.length == 2) {
                    msg[0] = msg[0].replaceAll('"', '')
                    msg[1] = msg[1].replaceAll('"', '')
                    res.json({
                        msg: msg
                    });
                }

            });
            console.log(req.files[i])
            console.log('RFC '+req.body.rfc[i]+' RFC receptor '+req.body.rfcProvider[i],req.body.tipoDocumento[i])
        }
    }
}

//LQMA ADD 18072017
FileUpload.prototype.post_filepdf = function(req, res, next) {
    String.prototype.replaceAllpdf = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };    

    var currentUrl = getDotNetApi(req);
     console.log(currentUrl + '1');
     console.log('req 1:');
     
     //console.log(req.files);
     console.log(req.body);

     var numFiles = req.files.length;
     var idApi = "1";

     if(req.files.length == 1)
        idApi = "3";        

    if (req.files.length == 1 || req.files.length == 2) {
        if (req.files[0].mimetype != "application/pdf") {
            var temp = req.files[0];
            req.files[0] = req.files[1]
            req.files[1] = temp;
        }

        console.log('req 2:');   
        console.log(req.body);

        var msg = [];
        for (var i in req.files) {
            request.post({
                url: currentUrl + idApi,
                form: JSON.stringify({
                    dir: "files",
                    folio: (req.files.length == 2)?req.body.folio[i]:req.body.folio,
                    proveedor: (req.files.length == 2)?req.body.provider[i]:req.body.provider,
                    rfc: (req.files.length == 2)?req.body.rfc[i]:req.body.rfc,
                    tipo: req.files[i].mimetype.substring(req.files[i].mimetype.indexOf("/") + 1),
                    nombre: req.files[i].filename,
                    idRol: (req.files.length == 2)?req.body.idRol[i]:req.body.idRol,
                    rfcProviderOC: (req.files.length == 2)?req.body.rfcProvider[i]:req.body.rfcProvider,
                    tipoDocumento: (req.files.length == 2)?req.body.tipoDocumento[i]:req.body.tipoDocumento
                })
            }, function(err, httpResponse, body) {
                msg.push(body)
                //msg.push('999999999')
                console.log(body)
                console.log(msg)
                if (msg.length == 1 && numFiles == 1) {
                    //msg[0] = msg[0].replaceAll('"', '')
                    //msg[1] = msg[1].replaceAll('"', '')
                    res.json({
                        msg: body//msg
                    });
                }

                if (msg.length == 2) {
                    
                    console.log(msg[0],[1])

                    //msg[0] = msg[0].replaceAll('"', '')
                    //msg[1] = msg[1].replaceAll('"', '')
                    
                    res.json({
                        msg: msg[0]+ '. ' +msg[1]
                    });
                }    


            });
            console.log(req.files[i])
            console.log('RFC '+req.body.rfc[i]+' RFC receptor '+req.body.rfcProvider[i],req.body.tipoDocumento[i])
        }
    }
}



FileUpload.prototype.post_logo = function(req, res, next) {
	
	var currentUrl =  getDotNetApi(req);
	 console.log(currentUrl + '2');
	
    request.post({
        url: currentUrl + "2",
        form: JSON.stringify({
            nombre: req.files[0].filename,
            rfc: req.body.rfc,
            ext: req.files[0].filename.substring(req.files[0].filename.indexOf(".") + 1)
        })
    }, function(err, httpResponse, body) {
        res.json(JSON.parse(body));
    });
}


function getDotNetApi(req){
	var myhost= req.get('host');
	var server = myhost.split(':');    
	//var currentUrl = req.protocol + '://' + server[0] + '/Proveedores/api/CargAapi/'  //LQMA 19072017
    var currentUrl = 'http://localhost:55442/api/CargAapi/' 
	return currentUrl;
}

module.exports = FileUpload;
