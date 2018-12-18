module.exports = class validate {

    constructor() {        
        this.error = "";
    }

    init(res) {
        if (this.error == '')
            return true;
        else {
            res.send({
                status: "ERR",
                error: this.error,
                section: "validation"
            });
            return false;
        }
    }

    is09(name, value) {
        if (value === null || value.search(/^[0-9]+$/))
            this.error = name + ' interrupt in a filter ' + '[is09]';
        else
            return true;
    }

    isFloat(name, value) {
        if (Number(value) === value && value % 1 !== 0)
            return false;
        else
            return true;
    }

    isAZ(name, value) {
        if (value === null || value.search(/^[a-zA-ZüÜğĞıİşŞçÇöÖ]+$/))
            this.error = name + ' interrupt in a filter ' + '[isAZ]';
        else
            return true;
    }

    isAZ09(name, value) {
        if (value === null || value.search(/^[a-zA-ZüÜğĞıİşŞçÇöÖ0-9]+$/))
            this.error = name + ' interrupt in a filter ' + '[isAZ09]';
        else
            return true;
    }

    isText(name, value) {
        if (value === null || value.search(/^[a-zA-Z0-9_ğĞüÜşŞİıÖöÇç+:\@\-\s.\/\(\),'\"\?\*\+\=\-]+$/))
            this.error = name + ' interrupt in a filter ' + '[isText]';
        else
            return true;
    }

    isEmail(name, value) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value === null || !re.test(String(value).toLowerCase()))
            this.error = name + ' interrupt in a filter ' + '[isEmail]';
        else
            return true;
    }

    check(name, variable, validations = []) {
        var thisClass = this;
        if (typeof variable !== 'undefined') {
            validations.forEach(function (option) {
                if (option != 'canBeNull')
                    thisClass[option](name, variable);
            });
        } else if (typeof variable === 'undefined' && validations.indexOf('canBeNull') === -1)
            this.error = name + ' interrupt in a filter ' + '[isNull]';

        // debuging
        // console.log(variable, validations);
    }

}