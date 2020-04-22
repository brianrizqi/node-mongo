const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/Order');
const Product = require('../models/Product');

router.get('/', (req, res, next) => {
    Order.find()
        .populate('product_id')
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200)
                    .json({
                        message: "Ada data",
                        result: result.map(result => {
                            return {
                                _id: result.id,
                                product: result.product_id.name,
                                quantity: result.quantity
                            }
                        }),
                    })
            } else {
                res.status(200)
                    .json({
                        message: "Tidak ada data",
                    })
            }
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.product_id)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product_id: req.body.product_id,
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json(result);
        }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
});

router.get('/:id', (req, res, next) => {
    Order.findById(req.params.id).populate('product_id')
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Ada data',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:id', (req, res, next) => {
    Order.findById(req.params.id)
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found !'
                })
            }
            return Order.remove({_id: req.params.id}).exec();
        })
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;
