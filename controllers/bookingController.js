const AppError = require('../utils/appError.Js');
const stripe=require('stripe')('sk_test_51NvgCcDCm7auwY2EyyYcXDEBv5kQvbQtGklJIgCuIrcfJzuf1qv2uAehiPAjYxPswLN6auJZxRAV1aYFpmoJBEgP00uYUmcA2N')
const Tour=require('./../model/tourModel.Js');
const APIFeatures =require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync.Js');
const factory=require('./handlerFactory')
const Booking=require('../model/bookingModel');
const User=require('../model/userModal.Js')
exports.getCheckOutSessions=async (req,res,next)=>{
    try{
    const tour=await Tour.findById(req.params.tourId);
    const bookingCount=await Booking.countDocuments({ tour: req.params.tourId });
    console.log("te dhenat",tour.maxGroupSize,bookingCount);
    if(bookingCount>=tour.maxGroupSize) return next(new AppError("There are no more free tickets to be sold!", 401))
    if(await Booking.findOne({user:req.user._id,tour:req.params.tourId})) return next(new AppError("You can not book 2 times for the same tour", 401))

      
    
    
    
    // if(Tour.findById(tour) && User.findById(req.user._id)) return next(new AppError("You can not book 2 times for the same tour", 401));
    // const session=await stripe.checkout.sessions.create({
    //     payment_method_types: ['card'],
    //     success_url: `${req.protocol}://${req.get('host')}/`,
    //     cancel_utl:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    //     costumer_email: req.user.email,
    //     child_reference_id: req.params.tourId,
    //     line_items:[{
    //         name:`${tour.name} Tour`,
    //         description:tour.summary,
    //         images:[`htts://www.natours.dev/img/tours/${tour.imageCover}`],
    //         amount:tour.price*100,
    //         quantity:1
    //     }]})
    const session=await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}?session_id={CHECKOUT_SESSION_ID}&tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        mode: 'payment',
        line_items:[{
            price_data:{
                currency: 'usd',
                unit_amount:tour.price*100,
                product_data:{
                    name:`${tour.name} Tour`,
                    description:tour.summary
                },  
                
            },
            quantity:1

        }]})
        res.status(200).json({
            status:'success',
            session
        })
    }
    catch(err){
        console.log(err);
        res.status(401).json({
            status:'failure',
            message:err
        })
    }    
    }
    ///?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}
exports.createBookingCheckOut = async (req, res, next)=>{
    const {tour, user, price}=req.query;

    if(!tour && !user && !price){
        return next();
    }
res.locals.user=User.findById(user)
    await Booking.create({
        tour,user,price
    })
    res.redirect(req.originalUrl.split('?')[0]);
}
