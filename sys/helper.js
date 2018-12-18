/*
    Required 
*/
const crypto = require('crypto');
const logSymbols = require('log-symbols');
const timestamp = require('time-stamp');
const DraftLog = require('draftlog');
const jwt = require('jsonwebtoken');
const email = require('mailer');

DraftLog(console);

/*
    Public Controllers
*/
const auth = require('../app/public/controller/auth');
const user = require('../app/public/controller/user');

var drafts = {

}
var classNames = {
    "auth": auth,
    "user": user,
}

module.exports = {

    errorHandling: function (log) {
        /*
            Error Handling
        */
        const model = require('./model').db;
        if (!model || typeof model !== 'object')
            console.log(log);

        if (typeof log === 'object') {
            model.none('UPDATE public.log SET message = $1, stack = $2, updated_at = NOW(), counter = counter + 1 WHERE message = $1; INSERT INTO public.log (message, stack) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM public.log WHERE message = $1);', [log.message, log.stack]);
            log = log.message;
        } else if (typeof log === 'string')
            model.none('UPDATE public.log SET message = $1, stack = $2, updated_at = NOW(), counter = counter + 1 WHERE message = $1; INSERT INTO public.log (message, stack) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM public.log WHERE message = $1);', [log, '']);
        else
            model.none('UPDATE public.log SET message = $1, stack = $2, updated_at = NOW(), counter = counter + 1 WHERE message = $1; INSERT INTO public.log (message, stack) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM public.log WHERE message = $1);', [JSON.stringify(log), '']);

    },


    log: function (draftName, log, type) {

        var text = draftName + ': ';

        if (type === undefined || type === null)
            text += logSymbols.info + timestamp('[YYYY:MM:DD HH:mm:ss]') + ' -> ' + log;
        else if (type === 'warning')
            text += logSymbols.warning + timestamp('[YYYY:MM:DD HH:mm:ss]') + ' -> ' + (log).warning;
        else if (type === 'success')
            text += logSymbols.success + timestamp('[YYYY:MM:DD HH:mm:ss]') + ' -> ' + (log).success;
        else if (type === 'error') {
            this.errorHandling(log);
            text += logSymbols.error + timestamp('[YYYY:MM:DD HH:mm:ss]') + ' -> ' + (typeof log === 'object' ? log.message : log).error;
        } else {
            this.errorHandling(log);
            text += logSymbols.error + timestamp('[YYYY:MM:DD HH:mm:ss]') + ' -> ' + (typeof log === 'object' ? log.message : log).error;
        }

        if (!drafts[draftName])
            drafts[draftName] = console.draft(text);
        else
            drafts[draftName]((logSymbols.info, timestamp('[YYYY:MM:DD HH:mm:ss]'), (text)));
    },

    checkJson: function (request) {
        var isJson = true;
        try {
            var json = JSON.parse(request);
        } catch (err) {
            isJson = false;
            this.error = 'Json format not supported.'
        }
        return isJson;
    },

    isFunction: function (functionToCheck) {
        if (typeof functionToCheck === "function")
            return true;
        else
            return false;
    },

    doMd5: function (value) {
        return crypto.createHash('md5').update(value).digest("hex");
    },

    isEmptyObject: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },


    routerRoutine: function (clsname, method, res, req) {        
        if (!classNames[clsname]) {
            res.status(404).send({
                status: "ERR",
                error: "Route not found"
            });
            return false;
        }

        var a = new classNames[clsname]();
        var get = req.params;
        var post = req.body;

        if (this.isFunction(a[method]))
            a[method](get, post, res, req);
        else
            res.status(404).send({
                status: "ERR",
                error: "Method not found"
            });

        // Debuging
        if (!this.isEmptyObject(post))
            console.log(post);
    },


    sendMail(to, subject, message) {
        return new Promise((resolve, reject) => {
            email.send({
                    host: "smtp.gmail.com",
                    port: "465",
                    ssl: true,
                    domain: "gmail.com",
                    to: to,
                    from: "sozzluk@gmail.com",
                    subject: subject,
                    html: message,
                    authentication: "login",
                    username: 'sozzluk@gmail.com',
                    password: 'siksik77'
                },
                function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else resolve(true);
                });


            email.send({
                    host: "smtp.gmail.com",
                    port: "465",
                    ssl: true,
                    domain: "gmail.com",
                    to: 'kutlu.sertac' + '@gmail.com',
                    from: "sozzluk@gmail.com",
                    subject: subject,
                    body: message,
                    authentication: "login", // auth login is supported; anything else $
                    username: 'sozzluk@gmail.com',
                    password: 'siksik77'
                },
                function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
        });
    },

    sessionController(req, res, next) {
        next();
        /*
        const nonAuthRoutes = ['/auth/login', '/user/signup', '/user/verify'];
        const bearerHeader = req.headers['authorization'];

        if (nonAuthRoutes.indexOf(req.url) !== -1)
            next();
        else {
            if (typeof bearerHeader !== 'undefined') {
                const token = bearerHeader.split(' ')[1];
                if (!token || token === 'undefined') {
                    res.status(401).json({
                        status: "ERR",
                        error: 'Token not found!'
                    });
                } else { // Uygunsa
                    var validate = require('./validate');
                    var modelAuth = require('../app/public/model/auth');


                    var filter = new validate();
                    filter.check('Token', token, ['isText']);
                    if (!filter.init(res)) res.status(401).json({
                        status: "ERR",
                        error: filter.error
                    });


                    jwt.verify(token, 'XZ32xdsa321.Ads.DSDS.asdZX332', (err, jwtSession) => { // Decrypt
                        if (err) {
                            res.status(401).json({
                                status: "ERR",
                                error: err
                            });
                        } else {
                            modelAuth = new modelAuth();
                            modelAuth.getSessionWithToken(jwtSession.user.id, token)
                                .then(session => {
                                    return modelAuth.pingPong(req.token)
                                        .then(pongData => {
                                            req.session = jwtSession.user;
                                            req.session.token = token;
                                            return next();
                                        })
                                })
                                .catch(err => {
                                    return res.status(401).json({
                                        status: "ERR",
                                        error: 'Session not found.',
                                        details: err
                                    });
                                })
                        }
                    })

                }
            } else {
                res.status(401).json({
                    status: "ERR",
                    error: 'Credentials not sent!'
                });
            }
        }
        */
    }
}