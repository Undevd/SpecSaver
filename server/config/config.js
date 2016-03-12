var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/hackathon',
        port: process.env.PORT || 4450,
        rootPath: rootPath
    },
    production: {
        db: 'mongodb://admin:Pa$$w0rd@ds064718.mlab.com:64718/specsavers',
        port: process.env.PORT || 80,
        rootPath: rootPath
    }
}