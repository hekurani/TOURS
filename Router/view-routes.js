const express=require('express');
const router=express.Router();
const authController=require('../controllers/authControler.Js');
const viewController=require('../controllers/viewController')
const bookingController = require('../controllers/bookingController')


router.get('/',bookingController.createBookingCheckOut,authController.isLoggedIn,viewController.getOverview);
router.get('/tour/:slug',authController.isLoggedIn,viewController.getTour);
router.get('/login',authController.isLoggedIn,viewController.getLoginForm);
router.get('/me',authController.isLoggedIn,viewController.getAccount);
router.get('/my-tours',authController.isLoggedIn,viewController.getMyTours)
router.get('/tourAdmin',authController.isLoggedIn,viewController.getToursInfo)
router.get('/forgotPassword',viewController.forgotPassword);
router.get('/resetPassword/:resetToken',viewController.resetPassword);
router.get('/usersAdmin',authController.isLoggedIn,viewController.getUSerInfo);
router.get('/reviewsAdmin',authController.isLoggedIn,viewController.getReviewInfo);


router.get('/SignUp',authController.isLoggedIn,viewController.getSignUpForm);
router.get('/Billing',authController.isLoggedIn,viewController.getBillForm)

router.post('/submit-user-data',viewController.updateUserData);
module.exports=router;