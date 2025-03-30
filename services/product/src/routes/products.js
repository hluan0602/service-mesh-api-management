const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
        try {
                const products = await Product.find();
                res.json(products);
        } catch (err) {
                res.status(500).json({ message: err.message });
        }
});

// Get a specific product
router.get('/:id', async (req, res) => {
        try {
                const product = await Product.findById(req.params.id);
                if (!product) return res.status(404).json({ message: 'Product not found' });
                res.json(product);
        } catch (err) {
                res.status(500).json({ message: err.message });
        }
});

// Create a product
router.post('/', async (req, res) => {
        const product = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                imageUrl: req.body.imageUrl
        });

        try {
                const newProduct = await product.save();
                res.status(201).json(newProduct);
        } catch (err) {
                res.status(400).json({ message: err.message });
        }
});

// Update a product
router.put('/:id', async (req, res) => {
        try {
                const product = await Product.findById(req.params.id);
                if (!product) return res.status(404).json({ message: 'Product not found' });

                if (req.body.name) product.name = req.body.name;
                if (req.body.description) product.description = req.body.description;
                if (req.body.price) product.price = req.body.price;
                if (req.body.category) product.category = req.body.category;
                if (req.body.imageUrl) product.imageUrl = req.body.imageUrl;
                product.updatedAt = Date.now();

                const updatedProduct = await product.save();
                res.json(updatedProduct);
        } catch (err) {
                res.status(400).json({ message: err.message });
        }
});

// Delete a product
router.delete('/:id', async (req, res) => {
        try {
                const product = await Product.findById(req.params.id);
                if (!product) return res.status(404).json({ message: 'Product not found' });

                await product.remove();
                res.json({ message: 'Product deleted' });
        } catch (err) {
                res.status(500).json({ message: err.message });
        }
});

module.exports = router;