var validate = require('../../../sys/validate');
var modelUser = require('../model/user');
const crypto = require('crypto');

module.exports = class {
    constructor() {
        this.model = new modelUser();
        this.helper = require('../../../sys/helper');
    }
    verify(get, post, res, req) {
        var filter = new validate();
        filter.check('User ID', get.id, ['is09']);
        filter.check('Verify Code', get.verify_code, ['isText']);

        if (!filter.init(res)) return false;

        this.model.checkVerifyCode(get.id, get.verify_code)
            .then(user => {
                if (user == null) {
                    res.send({
                        status: "ERR",
                        error: 'User or Verification Code Not Found or This account already verified.'
                    })
                } else {
                    this.model.setVerified(user.id)
                        .then(result => {
                            res.send({
                                status: "OK"
                            })
                        })
                        .catch(err => {
                            res.send({
                                status: "ERR",
                                error: 'User can not set to active. Please contact to SYS admin.'
                            })
                        })
                }
            })
            .catch(err => {
                console.log(err);
                res.send({
                    status: "ERR",
                    error: 'DB err.'
                })
            })
    }

    signup(get, post, res, req) {
        var filter = new validate();

        filter.check('E-mail', post.email, ['isEmail']);
        filter.check('Password', post.password, ['isText']);
        filter.check('Firstname', post.firstname, ['isAZ']);
        filter.check('Lastname', post.lastname, ['isAZ']);
        filter.check('Note', post.note, ['isText', 'canBeNull']);

        if (!filter.init(res)) return false;

        this.model.getByMail(post.email)
            .then(mailCheck => {
                if (mailCheck != null) { // Check mail
                    res.send({
                        status: "ERR",
                        error: "This e-mail already registered in indorse before."
                    });
                } else { // Register
                    post.verify_code = crypto.randomBytes(20).toString('hex');
                    post.password = this.helper.doMd5(post.password);
                    this.model.insert(post)
                        .then(user => {
                            // post.email = 'volkan.muhtar@gmail.com'; // Test manipulation

                            this.helper.sendMail(post.email, 'Your verification code', 'Hi, <a href="https://' + global.conf.server.domain + ':' + global.conf.server.port + '/user/verify/' + user.id + '/' + post.verify_code + '">Click here</a> for verify your account.')
                                .then(result => {
                                    res.send({
                                        status: "OK",
                                        data: user,
                                        details: "Please check your mailbox."
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.send({
                                        status: "ERR",
                                        error: 'Mail server err.'
                                    })
                                })

                        })
                        .catch(err => {
                            console.log(err);
                            res.send({
                                status: "ERR",
                                error: 'Something wrong on signup'
                            })
                        })
                }
            })
            .catch(err => {
                console.log(err);
                res.send({
                    status: "ERR",
                    error: 'Something wrong on DB'
                })
            })
    }
}