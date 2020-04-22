const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/product/thumbnail/');
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname.split(" ").join("_")}`);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200)
                    .json({
                        message: "Ada data",
                        result: result,
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

router.post('/', upload.single('thumbnail'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        thumbnail: req.file.path
    })
    product.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "Product added",
            });
        }).catch(err => {
        res.status(500).json({
            error: err,
            message: err.message
        })
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
