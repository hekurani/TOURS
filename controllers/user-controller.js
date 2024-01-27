const User = require('./../model/userModal.Js');
const sharp=require('sharp')
const catchAsync = require('./../utils/catchAsync.Js')
const AppError=require('./../utils/appError.Js');
const factory=require('./handlerFactory');
const multer=require('multer');
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
exports.resizeUserPhoto=catchAsync(async (req,res,next)=>{
    if(!req.file) return next()
    req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
    
   await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`./Project2/public/img/users/${req.file.filename}`);
next();
})
// exports.getAllusers=catchAsync(async (req,res)=>{
//     const users = await User.find();
//     res.status(200).json({
//     status:"success",
//    data:{
//     user:users
//    }
//     })
// })
const filterObj=(obj,...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el]=obj[el]
    })
    return newObj;
}
// exports.getUser=(req,res)=>{
//     res.status(500).json({
//     status:"error",
//     message:"this route is not designed yet"
//     })
// }
exports.createuser=(req,res)=>{
    res.status(500).json({
    status:"error",
    message:"this route is not designed yet, please use Sign Up instead"
    })
}
exports.updateuser=(req,res)=>{
    res.status(500).json({
    status:"error",
    message:"this route is not designed yet"
    })
}
exports.deleteMe=catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(200).json({
        status:"success",
        data:null
    })
})
exports.updateMe=catchAsync(async (req,res,next)=>{
if(req.body.password || req.body.passwordConfirm){
    return next(new AppError("This route is not for update password request",400))
}
// update user document
const filterBody = filterObj(req.body,'name','email');
if(req.file) filterBody.photo=req.file.filename;
const updatedUser =await User.findByIdAndUpdate(req.user.id,filterBody, {
    new:true,
    runValidators:true
})
res.status(200).json({
    status:"success",
    data:{
        user:updatedUser
    }
})

})
exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}
exports.getUser=factory.getOne(User);
exports.deleteuser=factory.deleteOne(User);
exports.updateuser=factory.updateOne(User);
exports.getAllusers=factory.getAll(User);