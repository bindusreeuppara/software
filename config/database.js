const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'uppara', // Enter your actual password
    port: 3307, // or 3037 if you're using that
    database: 'assetly' // Your schema name
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to assetlyproject database successfully!');
});

module.exports = connection;
