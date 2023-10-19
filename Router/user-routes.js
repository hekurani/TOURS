const express=require('express');
const authController=require('./../controllers/authControler.Js');


const userRouter=express.Router();
const routers=require('./../controllers/user-controller');
userRouter.post('/refreshToken',authController.refreshToken);
userRouter.get('/me',authController.protect,routers.getMe,routers.getUser);
userRouter.post('/signup',authController.CatchErrorUserPhoto,authController.signup,authController.resizeUserPhotoAndAuth);
userRouter.post('/login',authController.login)
userRouter.get('/logout',authController.logout);
userRouter.post('/forgotPassword',authController.forgotPassword);
userRouter.patch('/resetPassword/:token',authController.resetPassword);
userRouter.use(authController.protect);
userRouter.patch('/updateMyPassword',authController.protect,authController.updatePassword)


userRouter.patch('/updateMe',routers.CatchErrorUserPhoto,routers.resizeUserPhoto,routers.updateMe)
userRouter.delete('/deleteMe',routers.deleteMe)
userRouter.use(authController.restrictTo('admin'));
userRouter
    .route('/')
    .get(routers.getAllusers)
    .post(routers.createuser)
userRouter
    .route('/:id')
   .delete(routers.deleteuser)
    .patch(routers.updateuser)
    .get(routers.getUser)

module.exports=userRouter;