const bookingController=require('./../controllers/bookingController')
const express=require('express');
const authController=require('./../controllers/authControler.Js')

const router = express.Router();

router.get('/checkout-session/:tourId',authController.protect,bookingController.getCheckOutSessions)


module.exports=router;