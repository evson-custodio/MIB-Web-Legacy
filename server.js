function getIpAddress(interface) {
    const os = require('os');
    let address;

    os.networkInterfaces()[interface].forEach(netInfo => {
        if (netInfo.family === 'IPv4') {
            address = netInfo.address;
        }
    });

    return address;
}

function configureServer(mongodbURI, port, public) {
    const app = require('./config/express')(public);
    const server = require('http').createServer(app);
    const mongoose = require('./config/mongoose')('mongodb://' + mongodbURI);

    // Loopback Pseudo-Interface 1
    // Ethernet
    // Wi-Fi
    // eth0
    // wlan0
    // lo
    server.listen(port, getIpAddress('Loopback Pseudo-Interface 1'), () => {
        console.log('Server running on http://%s:%d', server.address().address, port);
    });
}

if (process.argv[1].endsWith('server.js')) {
    if (process.argv.length == 3) {
        configureServer(process.argv[2], 1024 + process.pid);
    } else if (process.argv.length == 4) {
        if (process.argv[3].match('\\b\\d+\\b')) {
            configureServer(process.argv[2], process.argv[3]);
        } else {
            configureServer(process.argv[2], 1024 + process.pid, process.argv[3]);
        }
    } else if (process.argv.length == 5) {
        configureServer(process.argv[2], process.argv[3], process.argv[4]);
    } else {
        console.log('Missing arguments!');
        console.log('Usage: node server.js <mongodbURI>');
        console.log('       node server.js <mongodbURI> <port>');
        console.log('       node server.js <mongodbURI> <public>');
        console.log('       node server.js <mongodbURI> <port> <public>');
    }
}

module.exports = configureServer;