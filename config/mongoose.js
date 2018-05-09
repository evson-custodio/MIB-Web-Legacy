//Variável Singleton para uma única Conexão
let connection;

//Função que será exportada como módulo, recebe uri de conexão como parâmentro
module.exports = function(uri) {
    //Testa se Singleton já possui conexão
    if (!connection) {
        //Incluindo Biblioteca Mongoose
        const mongoose = require('mongoose');
        
        //Configurações do Mongoose
        // mongoose.Promise = require('bluebird');
        mongoose.set('debug', true);
        mongoose.connect(uri, {
            poolSize: 10,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            keepAlive: 120
        });
        
        //Singleton configurado
        connection = mongoose.connection;
        
        //Relatório via console sobre status da Conexão
        connection.on('connected', function() {
            console.log('Mongoose! Connected on ' + uri);
        });
        
        connection.on('disconnected', function() {
            console.log('Mongoose! Disconnected on ' + uri);
        });
        
        connection.on('error', function(error) {
            console.log('Mongoose! Erro in Connect: ' + error);
        });
        
        process.on('SIGINT', function() {
            connection.close(function() {
                console.log('Mongoose! Finish Application!');
                process.exit(0);
            });
        });
    }
    
    //Retorna Conexão
    return connection;
}