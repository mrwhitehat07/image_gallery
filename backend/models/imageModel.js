const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    category: [{
        type: String,
        required: false,
    }],
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
},{
    timestamps: true
})


module.exports = mongoose.model('Image',imageSchema);