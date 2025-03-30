const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/products';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
})
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
        console.log(`Product service running on port ${PORT}`);
});