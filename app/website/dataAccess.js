var sql = require('mssql'),
    config = {};

var DataAccess = function(config) {
    //Inicializamos el objeto config
    this.config = config || {};
    //Inicializamos la conexión
    connectionString = {
        user: this.config.parameters.SQL_user,
        password: this.config.parameters.SQL_password,
        server: this.config.parameters.SQL_server, // You can use 'localhost\\instance' to connect to named instance
        database: this.config.parameters.SQL_database,
        connectionTimeout: this.config.parameters.SQL_connectionTimeout
    };
    this.types = {
        INT: sql.Int,
        DECIMAL: sql.Decimal(18, 2),
        STRING: sql.VarChar(8000),
        DATE: sql.DateTime
    }
    this.connection = new sql.Connection(connectionString);
};

//Query to stored procedure
DataAccess.prototype.query = function(stored, params, callback) {
    var self = this.connection;
    this.connection.connect(function(err) {
        // Stored Procedure
        var request = new sql.Request(self);
        // Add inputs
        params.forEach(function(param) {
                request.input(param.name, param.type, param.value);
            })
            // request.output('output_parameter', sql.VarChar(50));
        request.execute(stored)
            .then(function(recordsets) {
                callback(null, recordsets);
            }).catch(function(err) {
                callback(err);
            });
    });
};

module.exports = DataAccess;
