const catchAsync=require('./../utils/catchAsync.Js')
const AppError=require('./../utils/appError.Js')
const APIFeatures=require('./../utils/apiFeatures');
const Tour=require('./../model/tourModel.Js');
const User=require('./../model/userModal.Js');
const Reviews=require('./../model/reviewModel');
exports.deleteOne=Model => catchAsync(async (req,res,next)=>{
    
    if (Model==User) {
        await Reviews.deleteMany({ user: req.params.id });
    }
    const doc=await Model.findByIdAndDelete(req.params.id);
    if(!doc){
    return next(new AppError("There's no tour with that ID",404));
    }
    res.status(200).json({
        status:"success",
        data:null
    })
})

exports.deletetour=Model=>catchAsync(async (req,res,next)=>{
   
    await Tour.findByIdAndDelete(req.params.id);
    if(!Tour.findByIdAndDelete(req.params.id)){
    return next(new AppError("There's no tour with that ID",404));
    }
    res.status(200).json({
        status:"success",
        data:null
    })
        });
exports.updateOne=Model=>catchAsync(async (req,res,next)=>{
if(req.body.password)next(new AppError('You are not allowed to update password',403))

    const doc= await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(!doc){
        return next(new AppError(`No document with that ID`,404));
    }
    res.status(200).json({
        status:'success',
        data:{
            doc
        }
    })
    
})
exports.createOne=Model=>catchAsync(async (req,res,next)=>{ 
    req.body.imageCover='default.jpg';
    const newdoc = await Model.create(req.body);

    if (Model==Tour) {     
    req.tourId=newdoc._id;
    return next();
    }
    res.status(201).json({
       status:'Success',
       data:{
           doc:newdoc
       }
    })})   
    exports.getOne=(Model,popOptions)=>catchAsync( async (req,res,next)=>{
   let query=Model.findById(req.params.id);
   if(popOptions) query=query.populate(popOptions);
        const doc=await query;
        if(!doc){
           return next(new AppError("No tour found with that ID",404));
        }
        res.status(200).json({
           status:"success",
           data:{
            data:doc
           } 
           })    
        })      
        exports.getAll=Model=>catchAsync(async(req,res,next)=>{
            let filter = {}
            if(req.params.tourId) filter={tour:req.params.tourId};
            const features = new APIFeatures(Model.find(filter),req.query).filter().sort().pagination();
            // const doc=await features.query.explain();
            const doc=await features.query
        res.status(200).json({
            status:'success',
            results:doc.length,
            data:{
                doc
            }
        })
        })
