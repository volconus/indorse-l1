pgp = require('pg-promise')({});
const qrec = pgp.errors.queryResultErrorCode;

/*
    Config
*/
const fs = require('fs');
const ini = require('ini');
var conf = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

module.exports = class model {
    constructor() {
        var dbConfig;

        if (process.platform == 'win32')
            dbConfig = conf.database_win;
        else
            dbConfig = conf.database_linux;

        module.exports.qrec = qrec;       

        if (!module.exports.db)
            module.exports.db = pgp(dbConfig);
    }

}