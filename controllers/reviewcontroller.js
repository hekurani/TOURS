const Review = require('./../model/reviewModel');
const factory=require('./handlerFactory')
const Booking=require('./../model/bookingModel')
const catchAsync=require('./../utils/catchAsync.Js');
const AppError = require('../utils/appError.Js');
exports.restrictReview=catchAsync(async (req,res,next)=>{
    const booking=await Booking.findOne({tour:req.body.tour,user:req.body.user})
    console.log(booking);
    if(!booking) return next(new AppError('You are not allowed to review an Tour without attanding it!',401))

    return next()
})
exports.setTourUserIds=(req,res,next)=>{
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user.id;
    next();
}
exports.getReview=factory.getOne(Review);
exports.deleteReview=factory.deleteOne(Review);
exports.updateReview=factory.updateOne(Review);
exports.createReview=factory.createOne(Review);
exports.getAllReview=factory.getAll(Review);