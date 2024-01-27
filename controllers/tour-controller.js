const AppError = require('../utils/appError.Js');
const multer=require('multer');
const Tour=require('./../model/tourModel.Js');
const APIFeatures =require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync.Js');
const sharp=require('sharp');
const factory=require('./handlerFactory')
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
const uploadTourImages = upload.fields([
    {name:'imageCover',maxCount:1},
    {name:'images',maxCount:3}
]);
exports.CatchErrorTourPhoto = (req, res, next) => {
    uploadTourImages(req, res, (err) => {
    if(err) return next(new AppError("Image didnt upload successfully",400))
      next();
    });
  };
exports.resizeTourImages=async (req,res,next)=>{
    if(!req.files.imageCover || !req.files.images) return next()
    //Cover Image
    if(!req.params.id) req.body.imageCover= `tour-${req.tourId}-${Date.now()}-cover.jpeg`;
    else req.body.imageCover= `tour-${req.params.id}-${Date.now()}-cover.jpeg`; 
   await sharp(req.files.imageCover[0].buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`./Project2/public/img/tours/${req.body.imageCover}`);
req.body.images=[];
    
await Promise.all(req.files.images.map(async (file,i)=>{
    var filename='';
    if(!req.params.id) {
         filename=`tour-${req.tourId}-${Date.now()}-${i+1}.jpeg`
       
    }
    else {
         filename=`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`
       
    }
file
    await sharp(file.buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`./Project2/public/img/tours/${filename}`);
req.body.images.push(filename);
})
    )
    if(req.params.id) return next()
 const newTour=await Tour.findByIdAndUpdate(req.tourId,{images:req.body.images,imageCover:req.body.imageCover},{
    new:true,
    runValidators:true
})  
return res.status(201).json({
    status:'success',
    data:{
        newTour
    }
})
}
exports.aliasTopTours=(req,res,next)=>{
    req.query.limit=5;
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,price,summary,ratingsAverage,difficulty';
    next();
}
exports.updatetour=factory.updateOne(Tour);

exports.deletetour=factory.deleteOne(Tour);

exports.createtour = factory.createOne(Tour);
   
exports.getTours=factory.getAll(Tour);

exports.gettour=factory.getOne(Tour,{path:'reviews'})

exports.getTourStats =catchAsync(async (req,res) =>{
                
const stats = await Tour.aggregate([{
    $match : {ratingAverage:{$gte:4.5}}
},
{
    $group:{
        _id: {$toUpper:'$difficulty'},
        numTours:{$sum:1 },
        numRating:{$sum:'$RatingsQuantity'},
        avgRating: {$avg:'$ratingAverage'},
        avgPrice:{$avg:'$price'},
        minPrice:{$min:'$price'},
        maxPrice:{$max:'$price'}
    }
},{
    $sort: { avgPrice:1 }
}
])
res.status(200).json({
    status:'success',
    data:{
        stats
    }
})
                })
            
            exports.getMonthlyPlan =catchAsync( async (req, res) => {
           
          const year= req.params.year*1;
          const plan = await Tour.aggregate([{
$unwind:'$startDates'
          },
        //   },
          {
        $match : {
            startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte:new Date(`${year}-12-31`)
            }
        }
         },
         {
            $group:{
            _id:{$month:`$startDates`},
            numTourStarts:{$sum:1},
            tours: {$push: '$name'}    
            }
            
         },{
           $addFields: {month:'$_id'} 
         },{
            $project:{
                _id:0
            }
         },{
            $sort:{numberTourStarts:-1}
         }
    ]);
          
          res.status(200).json({
            status:'success',
            data:{
plan
            }
          })
            })
            exports.getToursWithin=catchAsync(async (req,res,next)=>{
                const {distance,latlng,unit}=req.params;
                  const [lat, lng]=  latlng.split(','); 
                  const radius = unit === "mi"? distance/3963.2 : distance/6378.1;
                  if(!lat && !lng) next(new AppError('Please Provide lantitude ang longitude in the format lat,lng.'))    
            console.log(distance,lat,lng,unit);
        const tours =await Tour.find({startLocation:{$geoWithin: {$centerSphere:[[lng,lat], radius] } }})
        res.status(200).json({
            status:'success',
            results:tours.length,
            data:{
                data:tours
            }
        })
                })
                exports.getDistances = catchAsync(async (req, res, next) => {
                    const { latlng, unit } = req.params;
                    const [lat, lng] = latlng.split(',');
                const multiplier= unit === "mi" ? 0.000621371 : 0.001;          
                    if (!lat || !lng) {
                        return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
                    }
                
                    const distances = await Tour.aggregate([
                        {
                            $geoNear: {
                                near: {
                                    type: 'Point',
                                    coordinates: [parseFloat(lng), parseFloat(lat)]
                                },
                                distanceField: 'distance',
                                spherical: true,
                                distanceMultiplier: multiplier
                            }
                        },
                        {
                            $project: {
                                distance: 1,
                                name: 1
                            }
                        }
                    ]);
                
                    res.status(200).json({
                        status: 'success',
                        data: {
                            data: distances
                        }
                    });
                });