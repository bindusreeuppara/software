const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const newsRoute = require('./routes/newsRoute');
const stockRoute = require('./routes/stockRoute');
const goldRoute = require('./routes/goldRoute');

// Use routes
app.use('/news', newsRoute);
app.use('/api/stocks', stockRoute);
app.use('/api/gold', goldRoute);

// Test endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Assetly Backend is running!',
        endpoints: {
            news: '/news',
            stocks: '/api/stocks',
            gold: '/api/gold'
        }
    });
});

const PORT = 8081;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Server startup error:', err);
    } else {
        console.log(`🚀 Assetly server running on port ${PORT}`);
        console.log(`📊 Database: assetlyproject`);
        console.log(`🔗 API endpoints available at http://localhost:${PORT}`);
    }
});
