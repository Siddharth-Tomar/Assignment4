// app.js - Updated Routes and Features for Product Data

var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Product = require('./models/product');
// Show all product info
app.get('/api/products', (req, res) => {
    Product.find()
        .then(product => res.json(product))
        .catch(err => res.status(500).send(err.message));

});

// Show a specific product based on asin
app.get('/api/products/:asin', (req, res) => {
    Product.findOne({ asin: req.params.asin })
        .then(product => {
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.json(product);
        })
        .catch(err => res.status(500).send(err.message));
});

// Insert a new product
app.post('/api/products', (req, res) => {
    Product.create(req.body)
        .then(newProduct => res.json(newProduct))
        .catch(err => res.status(500).send(err.message));
});

// Delete an existing product based on asin
app.delete('/api/products/:asin', (req, res) => {
    Product.deleteOne({ asin: req.params.asin })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).send('Product not found');
            }
            res.send('Product deleted successfully');
        })
        .catch(err => res.status(500).send(err.message));
});

// Update title and price of an existing product based on asin
app.put('/api/products/:asin', (req, res) => {
    const { title, price } = req.body;
    Product.findOneAndUpdate({ asin: req.params.asin }, { title, price }, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).send('Product not found');
            }
            res.json(updatedProduct);
        })
        .catch(err => res.status(500).send(err.message));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
