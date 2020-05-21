const bcrypt = require('bcrypt');

module.exports = class User {

    login;
    username;
    email;
    motifs;
    pull;
    password;

    constructor (data) {
        this.login = data.login;
        this.username = data.username;
        this.email = data.email;
        this.motifs = data.motifs;
        this.pull = data.pull;
        this.password = data.password;
        bcrypt.hash(data.password, 12).then(hashedPassword => {
            this.password = hashedPassword;
        });
    }

    async hasPassword (pass) {
        return bcrypt.compare(pass, this.password);
    }

}