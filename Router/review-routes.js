const reviewController=require('./../controllers/reviewcontroller')
const express=require('express');
const authController=require('./../controllers/authControler.Js')
const Router=express.Router({mergeParams:true});
Router.use(authController.protect);
Router.route('/')
.get(reviewController.getAllReview)
.post(authController.restrictTo('user','admin'),reviewController.setTourUserIds,reviewController.createReview)
Router.route('/:id').get(reviewController.getReview).delete(authController.restrictTo('user','admin'),reviewController.deleteReview).patch(authController.restrictTo('user','admin'),reviewController.updateReview)
// .patch(reviewController.updateReview)
module.exports=Router;