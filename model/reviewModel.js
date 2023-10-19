const mongoose=require('mongoose');
const Tour = require('./../model/tourModel.Js');
const reviewSchema=new mongoose.Schema({
   review: {
    type:String,
    required:[true,'Review can not be empty']
   } ,
   rating:{
    type:Number,
    min:1,
    max:5
   },
   createdAt: {
    type:Date,
    default:Date.now()
   },
   tour:{
    type:mongoose.Schema.ObjectId,
    ref:'Tour',
    required:[true,'Review must belong to a tour']
   },
   user:{
    type:mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'review must belong to an user']
   }},
   {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })
 reviewSchema.pre(/^find/, function (next) {
    console.log(4123);
// .populate('tour','name')
    this.populate({
        path: 'user',
        select:'name photo'
    }).select('-__v');
    next();

    // }).select('name').populate({
    //     path:'user',
    //     select:'name photo'
    // }).select('name photo')
    // next();
})
reviewSchema.statics.calcAverageRatings=async function(tourId){
   const stats=await this.aggregate([// returns an promise we need to await
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',//name of field tour
                nRating:{$sum:1},
                avgRating: {$avg:'$rating'}//name of field rating
            }
        }
    ])
    if(stats.length>0){
    await Tour.findByIdAndUpdate(tourId,{
        ratingQuantity: stats[0].nRating,
        ratingAverage: stats[0].avgRating
    })
}
else{
    await Tour.findByIdAndUpdate(tourId,{
        ratingQuantity:0,
        ratingAverage: 4.5
    })
}
    console.log("stats: "+ stats[0].nRating+" "+stats[0].avgRating);
}
reviewSchema.post('save', function(){
    // this points to current review
    this.constructor.calcAverageRatings(this.tour)
})
reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r=await this.findOne();
    console.log(this.r);
    next()
})
reviewSchema.post(/^findOneAnd/,async function(){
   await this.r.constructor.calcAverageRatings(this.r.tour);
})
reviewSchema.index({tour:1,user:1},{ unique:true });
const Review = mongoose.model('Review',reviewSchema);
module.exports=Review;