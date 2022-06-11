const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel.js')

// @desc Create new order
// @route POST /api/orders
// @access Private
const addorderitems = asyncHandler(async (req, res) => {
    const { image,totalAmount,isPaid,isApproved} = req.body
    if(image && image.length === 0){
        res.status(400)
        throw new Error('No order items')
        return
    }else{
        const order = new Order({
            user: req.user._id,
            image,
            totalAmount,
            isPaid,
            isApproved,
        })
        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})

// @desc get order by id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order  = await Order.findById(req.params.id).populate('user','firstname lastname email')
    if(order){
        res.json(order)
    }else{
        res.status(404)
        throw new Error('Order Not found')
    }
    
})

// @desc update order to paid
// @route update /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order  = await Order.findById(req.params.id)
    if(order){
        order.isPaid = true
        const updatedOrder = await order.save()
        res.json(updatedOrder)

    }else{
        res.status(404)
        throw new Error('Order Not found')
    }
    
})

// @desc get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const GetMyOrders = asyncHandler(async (req, res) => {
    const orders  = await Order.find({user: req.user._id})
    res.json(orders)
    
})

// @desc get orders
// @route GET /api/admin/orders
// @access Private/admin
const GetOrders = asyncHandler(async (req, res) => {
    const orders  = await Order.find({}).populate('user','id firstname lastname')
    res.json(orders)
    
})

module.exports = {
    addorderitems,
    getOrderById,
    updateOrderToPaid,
    GetMyOrders,
    GetOrders,
}