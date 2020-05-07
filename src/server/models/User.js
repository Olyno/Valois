const bcrypt = require('bcrypt');

module.exports = class User {

    login;
    username;
    email;
    password;

    constructor (data) {
        this.login = data.login;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
    }

    async hasPassword (pass) {
        return bcrypt.compare(pass, this.password);
    }

}