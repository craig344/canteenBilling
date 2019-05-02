const db = require('./../database');

var orders = {
    create: function (order, callback) {

        let orderObj = {
            total: order.total,
            item_count:order.item_count
           
        }

        let sql = 'INSERT INTO orders SET ?';
        let query = db.query(sql, orderObj, (err, result) => {
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
                    msg: "New Order Created Successfully",
                    order_id:result.insertId
                }
            }
            return callback(response);

        });
    },
    getAll: function (callback) {
        let sql = 'SELECT * FROM orders';
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                let response = {
                    success: false,
                    error: {
                        msg: "No orders Found"
                    }
                }
                return callback(response);
            } else {
                let response = {
                    success: true,
                    data: {
                        msg: "orders found.",
                        items: result
                    }
                }
                return callback(response);
            }
        });
    },
    getbyId: function (order, callback) {
        let sql = 'SELECT * FROM orders where id =?';
        let query = db.query(sql, [order.id], (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                let response = {
                    success: false,
                    error: {
                        msg: "No order Found"
                    }
                }
                return callback(response);
            } else {
                let response = {
                    success: true,
                    data: {
                        msg: "order found.",
                        item: result
                    }
                }
                return callback(response);
            }
        });
    },
    getOrderDetailsbyId: function (order, callback) {
        let sql = 'SELECT orders.id,orders.created_at,orders.total,order_items.quantity,order_items.rate,item.name FROM orders join order_items join item ON orders.id = order_items.order_id AND item.id = order_items.item_id where orders.id =?';
        let query = db.query(sql, [order.id], (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                let response = {
                    success: false,
                    error: {
                        msg: "No order Found"
                    }
                }
                return callback(response);
            } else {
                let response = {
                    success: true,
                    data: {
                        msg: "order found.",
                        item: result
                    }
                }
                return callback(response);
            }
        });
    },
    getbyDate: function (order, callback) {
        let sql = 'SELECT * from orders where DATE_FORMAT(`created_at`, "%Y-%m-%d") = ?';
        let query = db.query(sql, [order.date], (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                let response = {
                    success: false,
                    error: {
                        msg: "No order Found"
                    }
                }
                return callback(response);
            } else {
                let response = {
                    success: true,
                    data: {
                        msg: "order found.",
                        item: result
                    }
                }
                return callback(response);
            }
        });
    }

}

module.exports = orders;