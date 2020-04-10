const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            res.status(200)
                .json({result})
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product
        .save()
        .then(result => {
            console.log(result)
        });
    res.status(201).json({
        message: "Product added",
        createdProduct: product
    })
})

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .exec()
        .then(doc => {
            res.status(200).json({doc})
        })
        .catch(err => {
            console.log(err)
        })
})

router.patch('/:id/edit', (req, res, next) => {
    const id = req.params.id;
    Product.update(
        {_id: id},
        {
            $set: {
                name: req.body.name,
                price: req.body.price
            }
        })
        .exec()
        .then(result => {
            res.status(200).json({result})
        })
        .catch(err => {
            res.status(500).json({err})
        })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({result})
        })
        .catch(err => {
            res.status(500).json({err})
        });
})

module.exports = router;
