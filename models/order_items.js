const db = require('./../database');

var order_items = {
    create: function (order_item, callback) {

        let order_itemObj = {
            order_id: order_item.order_id,
            item_id: order_item.item_id,
            quantity: order_item.quantity,
            rate: order_item.rate
        }

        let sql = 'INSERT INTO order_items SET ?';
        let query = db.query(sql, order_itemObj, (err, result) => {
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
                    msg: "New order_Item Created Successfully"
                }
            }
            return callback(response);

        });
    },
    createMultiple: function (order_items, callback) {

        let order_items_arr = [];
        for (var i = 0; i < order_items.length; i++) {
            let order_itemObj = [
                order_items[i].order_id,
                order_items[i].item_id,
                order_items[i].quantity,
                order_items[i].rate
            ]
            order_items_arr.push(order_itemObj);
        }

        console.log(order_items_arr);


        let sql = 'INSERT INTO order_items (order_id,item_id,quantity,rate) VALUES ?';
        let query = db.query(sql, [order_items_arr], (err, result) => {
            if (err) {
                console.log(err);
                console.log("--------------------");
                
                console.log(query.sql);
                
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
                    msg: "New order_Item Created Successfully"
                }
            }
            return callback(response);

        });
    },
    
    getSalesPerDay: function (range, callback) {
        let sql = "SELECT DATE(order_items.created_at) as date,sum(order_items.quantity) as total_qty FROM order_items join item ON item.id = order_items.item_id where item.id=? AND date(order_items.`created_at`) >= date(?) AND date(order_items.`created_at`) <= date(?) group by DATE(order_items.created_at)";
        let query = db.query(sql, [range.id,range.startDate,range.endDate], (err, result) => {
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

module.exports = order_items;