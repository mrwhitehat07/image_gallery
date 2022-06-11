const express = require('express');
const router = express.Router();
const { 
    addorderitems, 
    GetMyOrders, 
    getOrderById, 
    GetOrders, 
    updateOrderToPaid,
} = require('../controllers/orderController');
const {protect,admin} = require('../middleware/authMiddleware.js');

router.route('/').post(protect,addorderitems).get(protect,admin,GetOrders)
router.route('/myorders').get(protect,GetMyOrders) 
router.route('/:id').get(protect,getOrderById) 
router.route('/:id/pay').put(protect,updateOrderToPaid) 

module.exports = router;