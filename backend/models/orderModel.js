const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User' 
    },
    image: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'Image'
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema);