const express=require('express');
const tourRouter=express.Router();
const reviewRouter=require('./../Router/review-routes');
const reviewController=require('./../controllers/reviewcontroller')
const routers=require('./../controllers/tour-controller')
const authControler=require('./../controllers/authControler.Js');
const { router } = require('../Main.Js');
// tourRouter.param('id',routers.checkID);
tourRouter.use('/:tourId/reviews',reviewRouter)
tourRouter
    .route('/monthly-plan/:year')
    .get(authControler.protect,authControler.restrictTo('lead-guide','admin','guide','superadmin'),routers.getMonthlyPlan)
tourRouter
     .route('/tour-stats')
     .get(routers.getTourStats)
tourRouter
      .route('/top-5-cheap')
       .get(routers.aliasTopTours,routers.getTours);
tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(routers.getToursWithin);
tourRouter.route('/distance/:latlng/unit/:unit').get(routers.getDistances)
tourRouter
    .route('/')
    .get(routers.getTours)
    .post(authControler.protect,authControler.restrictTo('admin','lead-guide','superadmin'),routers.CatchErrorTourPhoto,routers.createtour,routers.resizeTourImages)
    // .post(routers.checkBody,routers.createtour)
tourRouter
    .route('/:id')
    .delete(authControler.protect,authControler.restrictTo('admin','lead-guide','superadmin'),routers.deletetour)
    .patch(authControler.protect,authControler.restrictTo('admin','lead-guide','superadmin'),routers.CatchErrorTourPhoto,routers.resizeTourImages,routers.updatetour)
    .get(routers.gettour)

    module.exports=tourRouter;
