const db = require('../config/database');

exports.getGold = async (req, res) => {
    try {
        const query = 'SELECT * FROM USER_GOLD ORDER BY PURCHASE_DATE DESC';
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

exports.addGold = async (req, res) => {
    try {
        const { price, weight, purchase_date, amount } = req.body;
        const query = 'INSERT INTO USER_GOLD (PRICE, WEIGHT, PURCHASE_DATE, AMOUNT) VALUES (?, ?, ?, ?)';
        
        db.query(query, [price, weight, purchase_date, amount], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Gold investment added successfully', id: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
