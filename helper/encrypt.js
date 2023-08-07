const bcrypt = require('bcrypt')

const saltRounds = 10;

exports.encrypt = (data) => {
    return bcrypt.hashSync(data, saltRounds);
}

exports.match = (data, hash) => {
    return bcrypt.compareSync(data, hash);
}
