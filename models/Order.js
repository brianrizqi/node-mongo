const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    product_id: {type: mongoose.Schema.Types.ObjectID, ref: 'Product', required: true},
    quantity: {type: Number, default: 1}
})

module.exports = mongoose.model('Order', orderSchema)
