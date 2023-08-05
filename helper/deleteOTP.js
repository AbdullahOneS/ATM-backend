const {pool} = require('../config/db')

module.exports = async function deleteOTP (email) {
    pool.query('DELETE FROM otp Where email=?', [email], (err, result) => {
        if (err) throw(err);
    })
}