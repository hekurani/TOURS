const mongoose=require('mongoose');
const multer = require('multer');
const AppError = require("../utils/appError.Js");
const handleValidationErrorDB=err=>{
    const errors = Object.values(err.errors).map(el=>el.message);
const message=`Invalid input data. ${errors.join('. ')}`;
return new AppError(message,400);
}
// 
const handleJWTError = err => {
 return  new AppError('Invalid token! please log in with different creditianls',401)}; 
const handleDuplicateFieldDB=err=>{
console.log(err);
const dupField = Object.keys(err.keyValue)[0];
    const message=`Duplicate field value ${err.keyValue[dupField]}, please use another value`;
    return new AppError(message,400);
}
const handleJWTExpiredError=err=>new AppError('Token has been expired! please log in again',401);
const handleCastErrorDB = err =>{
    const message=`Invalid ${err.path}:${err.value}`;
    return new AppError(message,400);
}
const handleMulterError=err=>{
  const message=`The image Uploading isnt working correctly, error:${err.message}?!`
  return new AppError(message,400);
}
const sendErrorDev=(err,req,res)=>{
    if(req.originalUrl.startsWith('/api')){
return res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        stack:err.stack
    })
    }
    else{
      return res.status(err.statusCode).render('error',{
            title:'Something went wrong!',
            msg:err.message
        })
    }
}
const sendErrorProd = (err, req, res) => {
  // Ensure err is defined
  console.log(err);
  if(!err){
    console.log("no error")
  }

  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: err,
    });
  }

  // Check if err.isOperational is undefined or false
  if (!err.isOperational) {
    console.log(err);
    return res.status(err.statusCode || 500).render('error', {
      title: 'Something went wrong!',
      msg: err.message || 'Please try again later.',
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode || 500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status=err.status||'error';
    // process.env.NODE_ENV=== 'development'
    
   if(process.env.NODE_ENV==='development'){  
       sendErrorDev(err,req,res);
   }
   else if(process.env.NODE_ENV=== 'production'){
    let error = {...err};  
    error.message=err.message;
console.log("error",error);

    if(error.name==="CastError") error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name instanceof mongoose.Error.ValidatorError) error=handleValidationErrorDB(error);
    if(error.name==='JsonWebTokenError') error=handleJWTError(error)
    if(err instanceof multer.MulterError) error=handleMulterError(error)
    sendErrorProd(error,req,res);
   }
}