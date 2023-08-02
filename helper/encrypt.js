const bcrypt = require('bcrypt')

const saltRounds = 10;

exports.encrypt = (pin) => {
    return bcrypt.hashSync(pin, saltRounds);
}

exports.match = (pin, hash) => {
    return bcrypt.compareSync(pin, hash);
}
