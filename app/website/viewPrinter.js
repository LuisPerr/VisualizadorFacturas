var ViewPrinter = function(conf) {
    conf = conf || {};
}

function logError(err, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write("Error: " + err);
    res.end("");
}

ViewPrinter.prototype.see = function(res, object) {
    //Estándar de implementación de errores
    if (object.error) {
        logError(object.error, res);
        return;
    }
    if (object.result) {
        res.json(object.result);
    }
}

module.exports = ViewPrinter;
