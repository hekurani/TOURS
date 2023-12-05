const Tour = require('../model/tourModel.Js');
const catchAsync=require('../utils/catchAsync.Js');
const AppError=require('../utils/appError.Js')
const User=require('../model/userModal.Js')
const Booking=require('../model/bookingModel');
const Reviews=require('../model/reviewModel');
const crypto=require('crypto');
exports.getOverview=catchAsync(async (req,res,next)=>{
    // 1) Get Tour Data from collection
    const tours = await Tour.find();

    const nonce = crypto.randomBytes(16).toString('base64');
    // 2) Build Template 
    res.status(200).render('overview',{
        title:'All Tours',
        tours,
        nonce
    })

})
exports.getBillForm=catchAsync(async (req,res,next)=>{
res.status(200).render('Billing',{
    title:'Bill'
})
})
exports.getSignUpForm=catchAsync(async (req,res,next)=>{ 
    res.status(200).render('SignUp',{
        title:'Create New Account'
    })
}) 
exports.getMyTours=catchAsync(async (req,res,next)=>{
    // 1) find all bookings
  const bookings = await Booking.find({user:req.user.id});    
const tourIds=bookings.map(el=>el.tour);
const tours=await Tour.find({ _id: {$in: tourIds}})// find in tour array
    //2)find tours with the returned id's
res.status(200).render('overview',{
title:'myTours',
tours
})

})
exports.getToursInfo=catchAsync(async (req,res,next)=>{
const tours=await Tour.find();
const nonce = crypto.randomBytes(16).toString('base64');
const guides = await User.find({ role: { $in: ['guide', 'lead-guide'] } });
res.status(200).render('adminTours',{
    title:'adminTours',
    tours,
    nonce,
    guides
})
})
exports.resetPassword=(req,res,next)=>{
    res.status(200).render('resetPassword',{
        title:'resetPassword',
        resetToken:req.params.resetToken
    })
}
exports.forgotPassword=(req,res,next)=>{
    res.status(200).render('forgotPassword',{
        title:'ForgotPassword'
    })
}
exports.getUSerInfo=catchAsync(async (req,res,next)=>{
    const users=await User.find();
    
    res.status(200).render('adminUsers',{
        title:'UserAdmin',
        users
    })
})
exports.getReviewInfo=catchAsync(async (req,res,next)=>{
    const reviews=await Reviews.find();
res.status(200).render('adminReviews',{
    tittle:'ReviewAdmin',
    reviews
})
})
exports.getTour=catchAsync( async (req,res,next)=>{
    const tour = await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields:'review  ratingAverage user'
    });
    if(!tour){
        return next(new AppError('There are no tours with that name',401))
    }
    let myReview=null;
    let bookedTour=null;
    if(req.user){
    myReview=await Reviews.findOne({user:req.user._id,tour:tour._id})
 bookedTour=await Booking.findOne({user:req.user._id,tour:tour._id})
    }
 console.log(bookedTour)
    res.status(200).render('tour',{
        title:`${tour.name} Tour`,
        tour,
        myReview,
        bookedTour
    })
})
exports.getLoginForm=(req,res,next)=>{
    res.status(200).render('login',{
        title:'Log into your account'
    })
}
exports.getAccount=(req,res)=>{
    res.status(200).render('account',{
        title:'Your account'
    })
}
exports.updateUserData=catchAsync(async (req,res,next)=>{
const updatedUser = await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email:req.body.email
},{
    new:true,
    runValidators:true
})
res.status(200).render('account',{
    title:'Your account',
    user:updatedUser
})
})