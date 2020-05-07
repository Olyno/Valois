const fs = require('fs-extra');
const path = require('path');
const User = require('../models/User');

class Database {

    users = [];
    usersPath = path.join(__dirname, 'users.json');

    setup() {
        return new Promise((resolve, rejects) => {
            if (!fs.existsSync(this.usersPath)) {
                fs.writeFile(this.usersPath, '[]')
                    .then(() => resolve([]))
                    .catch(rejects);
            } else {
                const users = require(this.usersPath);
                for (const data of users) {
                    this.users.push(new User(data));
                }
            }
        })
    }

    save() {
        return new Promise((resolve, rejects) => {
            fs.writeFile(this.usersPath, JSON.stringify(this.users, null, 2))
                .then(resolve)
                .catch(rejects);
        })
    }

    addUser(user) {
        this.users.push(user);
        this.save();
    }

    removeUser(user) {
        this.users = this.users.filter(u => u.name !== user.name);
        this.save();
    }

}

const db = new Database();

db.setup();

module.exports = db;