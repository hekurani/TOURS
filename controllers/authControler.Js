const User=require('./../model/userModal.Js');
const jwt = require('jsonwebtoken');
const sharp=require('sharp')
const catchAsync=require('./../utils/catchAsync.Js');
const AppError = require('./../utils/appError.Js');
const crypto=require('crypto');
const multer=require('multer');
const {promisify} = require('util')
const Email=require('./../utils/email');
const bcrypt=require('bcrypt')
const sendEmail=require('./../utils/email');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const multerStorage=multer.memoryStorage();//saving in a disk this image and saved as buffer
const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb(new AppError("The uploaded file is not Image?!",400),false)
    }
}
const upload=multer({
 storage:multerStorage,
 fileFilter:multerFilter
})
const uploadMiddleware = upload.single('photo');
exports.CatchErrorUserPhoto = (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
    if(err) return next(new AppError("Image didnt upload successfully",400))
      next();
    });
  };
exports.resizeUserPhotoAndAuth=catchAsync(async (req,res,next)=>{
    if(req.file){
        req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
    
        await sharp(req.file.buffer)
         .resize(500,500)
         .toFormat('jpeg')
         .jpeg({quality:90})
         .toFile(`./Project2/public/img/users/${req.file.filename}`);
          await User.findByIdAndUpdate(req.user._id,{
        "photo":req.file.filename
    }, {
        new:true,
        runValidators:true
    })
    }
   
    createSendToken(req.user,201,res,-1,req);
})


const filterObj=(obj,...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el]=obj[el]
    })
    return newObj;
}
const signToken = (id, user) => {
    return jwt.sign({id, userProfile: {
        name: user.name,
        email: user.email,
        role: user.role
    }}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}
const signResetToken = (id, time) => {
    let expireTime; // Declare expireTime variable here
  
    if (time ===-1) {
      expireTime = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN);
      expireTime *= 24 * 60 * 60;

      return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: expireTime
      });
    } else {
        console.log("time",time)
          return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: time
      });
    }
  };
const createSendToken = (user, statusCode,res,time,req)=>{
    user.password=undefined;
    const token = signToken(user._id, user);
    const resetToken=signResetToken(user._id,time);
    
    if(resetToken){
        return res.status(statusCode).json({
            status:"success",
            token,
            resetToken
        })
    }
 // Set the refreshToken header in the response
    return res.status(406).json({
        status:"failure"  })
}
exports.signup = catchAsync( async (req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });
    req.user=newUser;
    console.log("new User",req.body)
    const url=`${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser,url).sendWelcome();
    next() 
})
exports.login=catchAsync(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email||!password){
return next(new AppError("please provide email and password",400));
    }
    const user=await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password',401));
    }
    createSendToken(user,201,res,-1,req);s
})
exports.protect = catchAsync(async (req,res,next)=>{
//1) getting token and check if its there
console.log("refg",req.headers);
let token; 
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
     token = req.headers.authorization.split(' ')[1];
}

if(!token){
   return next(new AppError('You are not loged in! Please log in to get access',401))
}
//2) verification the token
const decoded=await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//3)Chek if user still exists
const freshUser=await User.findById(decoded.id);
if(!freshUser){
    return next(new AppError('The Token belonging to this user does no longer exists',401));
}

//4) if User changed password after JWT was issued
if(await freshUser.changedPasswordAfter(decoded.iat)){
    console.log
    return next(new AppError('user recently changed password',401));
}
req.user = freshUser;
res.locals.user=freshUser;
    next();
})
exports.restrictTo = (...roles) => {
    return (req, res, next)=>{   
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have the permission to perform this action',403))
        }
        next();
    }
}
exports.forgotPassword=catchAsync(async (req,res,next)=>{
    //1) get user based on post email
const user = await User.findOne({email:req.body.email});
if(!user){
    return next(new AppError('Theres no user',404))
}
    //2) generate the random reset token
const resetToken = user.createPasswordResetToken();
await user.save({validateBeforeSave:false});
    //3)send it to user's email
const resetURL= `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
const message=`Forgot an password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didnt change your password, please ignore this email!`;
try{
// await sendEmail({
//     email:user.email,
//     subject:'Your password reset token (valid for 10 min)',
//     message
// })
await new Email(user,resetURL).sendPasswordReset()
res.status(200).json({
    status:'success',
    message:'Token sent to email'
})
}
catch(err){
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    console.log(err);
    await user.save({validateBeforeSave:false});
    return next(new AppError('There was an error while sending email'),500);
}
})
exports.resetPassword=catchAsync(async (req,res,next)=>{
const hashedToken = crypto
.createHash('sha256')
.update(req.params.token)
.digest('hex');
const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}
});//,passwordResetExpires:{$gt:Date.now()},passwordResetExpires:{$gt:Date.now()}
if(!user){
    return next(new AppError('token is invalid or has expired',400));
}
await User.findByIdAndUpdate(user._id,{
    passwordConfirm:await bcrypt.hash(req.body.passwordConfirm,12),
    password:await bcrypt.hash(req.body.password,12)
})
user.password=req.body.password;
user.passwordConfirm = req.body.passwordConfirm;
user.passwordResetToken=undefined;
user.passwordResetExpires=undefined;
createSendToken(user,200,res,10*60,req);
// const token=signToken(user._id);
//     res.status(200).json({
//         status:'success',
//         token:token
//     })
})
exports.updatePassword =catchAsync( async (req,res,next)=>{
    // 1) get user from the collection
    const user = await User.findById(req.user.id).select('password');

    // 2) check if the posted current password is correct
    if(!await user.correctPassword(req.body.passwordCurrent,user.password)){
        return next(new AppError('Your correct password is wrong',401));
    }
    //3) if so, update the password
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
    //4) Log user in, send JWT
    createSendToken(user,200,res,0,req);
})
exports.isLoggedIn=catchAsync(async (req,res,next)=>{
    let token;
    if(req.cookies.jwtToken){
        token=req.cookies.jwtToken
   }
    if(token){
        try{
            const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
            const currentUser=await User.findById(decoded.id);
            if(!currentUser){
                return next()
            }
            if(currentUser.changedPasswordAfter(decoded.iat)){
                return next()
            }
            
            res.locals.user=currentUser;
            req.user=currentUser;
            return next();
        }
        catch(err){
return next();
    }
    }
    console.log("Arrived");
    next();
})
exports.refreshToken = async (req,res,next)=>{
    console.log("req",req.headers);

    if(req.headers.refreshtoken){
     const refreshToken=req.headers.refreshtoken;
     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, 
        async (err, decoded) => {
            if (err) {
                // Wrong Refesh Token
                return res.status(406).json({message:'Unauthorized'});
            }
            else {
                const decoded = await promisify(jwt.verify)(refreshToken,process.env.REFRESH_TOKEN_SECRET);
                const expirationTimeInSeconds = decoded.exp;

                // You can also calculate the remaining time until token expiration
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const timeUntilExpirationInSeconds = expirationTimeInSeconds - currentTimeInSeconds - 600; // Subtract 10 minutes
          
          
                const user=await User.findById(decoded.id);
                if(user){
                    const accessToken = signToken(user.id,user)
                    const refreshToken2 =signResetToken(user.id,timeUntilExpirationInSeconds);
                    req.headers.refreshToken=refreshToken2;
                    res.locals.user=user;
                    return res.json({status:'success', accessToken,refreshToken2});
                }
                else{
                    return  next();
                }
 
            }
        });
    }
    else{
        return next(new AppError('you have not loged In?! Please Log In'));
    }
}
exports.logout = (req, res) => {
    req.headers.refreshToken=null;
    req.headers.Authorization='Bearer '+null;
    res.locals.user=null;
    req.user=null;
    res.status(200).json({ status: 'success' });
};
  