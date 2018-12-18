model = require('../../../sys/model');

module.exports = class extends model {
    login(email, password) {
        return new Promise(function (resolve, reject) {
            model.db.one('SELECT id, email, firstname, lastname, note, status FROM public.user WHERE email = $1 and password = $2 and status = $3', [email, password, 'A'])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    err.code === model.qrec.noData ? reject(null) : reject(err);
                })
        })
    }

    insertSession(user_id, ip, token) {
        return new Promise(function (resolve, reject) {
            model.db.one('INSERT INTO public.user_session (user_id, ip_address, token) VALUES ($1, $2, $3) RETURNING id, token', [user_id, ip, token])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    getSessionWithId(user_id) {
        return new Promise(function (resolve, reject) {
            model.db.one('SELECT * FROM public.user_session WHERE user_id = $1 and status = $2', [user_id, 'A'])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    err.code === model.qrec.noData ? reject(null) : reject(err);
                })
        })
    }

    getSessionWithToken(user_id, token) {
        return new Promise(function (resolve, reject) {
            model.db.one('SELECT * FROM public.user_session WHERE user_id = $1 and token = $2 and status = $3', [user_id, token, 'A'])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    err.code === model.qrec.noData ? reject(null) : reject(err);
                })
        })
    }

    removeSession(user_id) {
        return new Promise(function (resolve, reject) {
            model.db.none('UPDATE public.user_session SET status = $1 WHERE user_id = $2', ['P', user_id])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    pingPong(token) {
        return new Promise(function (resolve, reject) {
            model.db.none('UPDATE public.user_session SET last_action_date = NOW() WHERE token = $1', [token])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    clearDeadSessions(seconds) {
        return new Promise(function (resolve, reject) {
            model.db.result('UPDATE public.user_session SET status = $1 WHERE extract(epoch from (NOW() - last_action_date)) > $2 and status = $3', ['P', seconds, 'A'])
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}