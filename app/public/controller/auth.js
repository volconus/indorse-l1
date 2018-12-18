var validate = require('../../../sys/validate');
var modelAuth = require('../model/auth');
var jwt = require('jsonwebtoken');


module.exports = class {
    constructor() {
        this.model = new modelAuth();
        this.helper = require('../../../sys/helper');
    }

    login(get, post, res, req) {
        var filter = new validate();
        filter.check('E-Mail', post.email, ['isEmail']);
        filter.check('Password', post.password, ['isText']);
        if (!filter.init(res)) return false;
 
        post.password = this.helper.doMd5(post.password);


        this.model.login(post.email, post.password)
            .then(user => {
                return this.sessionCheck(req, user)
                    .then(session => {
                        res.send({
                            status: "OK",
                            session: {
                                token: session.token
                            },
                            user: user
                        });
                    })
            })
            .catch(err => {
                console.log(err);
                err === null ? res.send({
                    status: "ERR",
                    error: "Username or password is incorrect."
                }) : res.send({
                    status: "ERR",
                    error: err
                })
            })
    }

    sessionCheck(req, user) {
        var parent = this;
        return new Promise(function (resolve, reject) {
            parent.model.getSessionWithId(user.id) // Is Session Exists
                .then(session => {
                    resolve(session);
                })
                .catch(err => {
                    if (err === null) { // No                   
                        jwt.sign({
                            user
                        }, 'XZ32xdsa321.Ads.DSDS.asdZX332', (err, token) => {
                            parent.model.insertSession(user.id, req.connection.remoteAddress, token)
                                .then(session => {
                                    resolve(session);
                                })
                                .catch(err => { // insertSession
                                    reject(err);
                                })
                        })
                    } else // getSession
                        reject(err);
                });


        })
    }
}