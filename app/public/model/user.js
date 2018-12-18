model = require('../../../sys/model');

module.exports = class extends model {
    get(val) {
        return new Promise(function (resolve, reject) {
            model.db.one('SELECT id, email, firstname, lastname, note, status FROM public.user WHERE id = $1', [val.id])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    // err.code === model.qrec.noData ? resolve(null) : reject(err);
                    reject(err);
                })
        })
    }

    getByMail(email) {
        return new Promise(function (resolve, reject) {
            model.db.one('SELECT id, email, firstname, lastname, note, status FROM public.user WHERE email = $1', [email])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    err.code === model.qrec.noData ? resolve(null) : reject(err);                
                })
        })
    }

    checkVerifyCode(id, verify_code) {
        return new Promise(function (resolve, reject) {
            model.db.one('SELECT id, email, firstname, lastname, note, status FROM public.user WHERE id = $1 and verify_code = $2 and status = $3', [id, verify_code, 'P'])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    err.code === model.qrec.noData ? resolve(null) : reject(err);                
                })
        })
    }

    insert(val) {
        return new Promise(function (resolve, reject) {
            model.db.one('INSERT INTO public.user (email, password, firstname, lastname, note, verify_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [val.email, val.password, val.firstname, val.lastname, val.note, val.verify_code])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    setVerified(id) {
        return new Promise(function (resolve, reject) {
            model.db.none('UPDATE public.user SET status = $1 WHERE id = $2', ['A', id])
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

}