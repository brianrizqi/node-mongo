const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders'
    });
});

router.get('/:invoice', (req, res, next) => {
    res.status(200).json({
        invoice: req.params.invoice
    });
})

module.exports = router;
