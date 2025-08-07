const db = require('../config/database');

exports.getStocks = async (req, res) => {
    try {
        const query = 'SELECT * FROM USER_STOCKS ORDER BY PURCHASE_DATE DESC';
        db.query(query, (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addStock = async (req, res) => {
    try {
        const { stock_id, stock_name, quantity, price, sector, purchase_date, amount } = req.body;
        const query = 'INSERT INTO USER_STOCKS (STOCK_ID, STOCK_NAME, QUANTITY, PRICE, SECTOR, PURCHASE_DATE, AMOUNT) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        db.query(query, [stock_id, stock_name, quantity, price, sector, purchase_date, amount], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Stock added successfully', id: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
