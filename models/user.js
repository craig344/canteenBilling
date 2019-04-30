const db = require('./../database');
var crypto = require('crypto');

var user = {
    login: function (user, callback) {
        //check if user with phone and password exists in table
        let sql_salt = 'SELECT salt FROM users WHERE phone = ?';
        let query_salt = db.query(sql_salt, user.phone, (err, result) => {
            if (err) {
                console.log(err);
                let response = {
                    success: false,
                    error: {
                        code: err.code,
                        msg: err.sqlMessage
                    }
                }
                return callback(response);
            }

            if (result.length == 0) {

                let response = {
                    success: false,
                    error: {
                        msg: "No User Found"
                    }
                }
                return callback(response);
            }

            let salt = result[0].salt;

            var passwordData = sha512(user.password, salt);
            let sql_password = 'SELECT id FROM users WHERE phone = ? AND passwordHash = ?';
            let query_salt = db.query(sql_password, [user.phone, passwordData.passwordHash], (err, result) => {
                if (err) throw err;
                if (result.length == 0) {
                    let response = {
                        success: false,
                        error: {
                            msg: "No User Found with given credentials"
                        }
                    }
                    return callback(response);
                } else {
                    let response = {
                        success: true,
                        data: {
                            msg: "user found.",
                            user_id: result
                        }
                    }
                    return callback(response);
                }
            });

        });

    },
    create: function (user, callback) {
        var salt = genRandomString(16); /** Gives us salt of length 16 */
        var passwordData = sha512(user.password, salt);

        let userObj = {
            name: user.name,
            phone: user.phone,
            salt: passwordData.salt,
            passwordHash: passwordData.passwordHash,
            role: "admin"
        }

        let sql = 'INSERT INTO users SET ?';
        let query = db.query(sql, userObj, (err, result) => {
            if (err) {
                console.log(err);
                let response = {
                    success: false,
                    error: {
                        code: err.code,
                        msg: err.sqlMessage
                    }
                }
                return callback(response);
            }
            let response = {
                success: true,
                data: {
                    msg: "New User Created Successfully"
                }
            }
            return callback(response);

        });
    },
    getAll: function (callback) {
        let sql = 'SELECT id,name,phone,role FROM users';
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                let response = {
                    success: false,
                    error: {
                        msg: "No Users Found"
                    }
                }
                return callback(response);
            } else {
                let response = {
                    success: true,
                    data: {
                        msg: "users found.",
                        users: result
                    }
                }
                return callback(response);
            }
        });
    },
    getbyId: function (user, callback) {
        let sql = 'SELECT id,name,phone,role FROM users where id =?';
        let query = db.query(sql, [user.id], (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                let response = {
                    success: false,
                    error: {
                        msg: "No User Found"
                    }
                }
                return callback(response);
            } else {
                let response = {
                    success: true,
                    data: {
                        msg: "user found.",
                        users: result
                    }
                }
                return callback(response);
            }
        });

    },
    update: function (user, callback) {
        checkDuplicateNumber(user.phone, function (response) {
            if (response.data[0].id == user.id) {

                var salt = genRandomString(16); /** Gives us salt of length 16 */
                var passwordData = sha512(user.password, salt);

                let sql = 'UPDATE users SET name = ?,phone = ?,role=?,salt=?,passwordHash=? where id = ?';
                let query = db.query(sql, [user.name, user.phone, user.role,salt,passwordData.passwordHash, user.id], (err, result) => {
                    if (err) {
                        console.log(err);
                        let response = {
                            success: false,
                            error: {
                                code: err.code,
                                msg: err.sqlMessage
                            }
                        }
                        return callback(response);
                    }
                    let response = {
                        success: true,
                        data: {
                            msg: "User Updated Successfully"
                        }
                    }
                    return callback(response);

                });
            } else {
                let response = {
                    success: false,
                    data: {
                        msg: "Number already exists"
                    }
                }
                return callback(response);
            }

        });
    },
    deletebyId: function (user, callback) {
        let sql = 'DELETE FROM users where id =?';
        let query = db.query(sql, [user.id], (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                let response = {
                    success: false,
                    error: {
                        msg: "No User Found"
                    }
                }
                return callback(response);
            } else {
                let response = {
                    success: true,
                    data: {
                        msg: "user deleted.",
                        users: result
                    }
                }
                return callback(response);
            }
        });

    }

}

module.exports = user;

/* ---------- Utility Functions ---------- */

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};


var checkDuplicateNumber = function (phone, callback) {
    let sql = 'SELECT id FROM users where phone =?';
    let query = db.query(sql, [phone], (err, result) => {
        if (err) throw err;
        console.log(result);

        if (result.length == 0) {
            let response = {
                success: false
            }
            return callback(response);
        } else {
            let response = {
                success: true,
                data: result
            }
            return callback(response);
        }

    });
};