var winston = require('winston');
var ENV = 'development' || process.env.NODE_ENV;
var config = require('config');

// доки: https://www.npmjs.com/package/winston
function getLogger(module) {
    var path = module.filename.split('\\').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: ENV == 'development' ? 'debug' : 'error',
                label: path
            }),
            new winston.transports.File({
                filename: config.get('dirs:logs') + '\\log.txt'
            })
        ]
    });
};

module.exports = getLogger;