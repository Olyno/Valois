const me = require('./me');
const designs = require('./designs');

exports.me = { path: '/me', router: me };
exports.designs = { path: '/designs', router: designs };
exports.routes = [
    exports.me,
    exports.designs
]