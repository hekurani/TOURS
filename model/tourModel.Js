const mongoose=require('mongoose');
const slugify=require('slugify');
const validator = require('validator');
// const User=require('./userModal.Js');
const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have a name'],
        unique:true,
        trim:true,
        maxlength:[40,'A tour name must have less or equal than 40 characters'],
        minlength:[10,'a tour must have more or equal than 10 characters']
    },
    duration:{
type:Number,
required:[true,'A tour must have an duration']
    },
    slug:String,
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have an group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have an difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
          }
    },
    ratingAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1'],
        max:[5,'Rating must be below 5'],
        set:val => Math.round(val * 10)/10
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'A tour must have an price']
    },
    priceDiscount:{
    type:Number,
    validate:{
   validator:function(val){
        return val>this.price
    },
    message:'Discount price must be below the real price'
}
    },
    summary:{
        type:String,
trim:true
    },
    description:{
        type:String,
        trim:true,
        required:[true,'A tour must have an description']
    },
    imageCover:{
        type:String,
        required:[true,'A tour must have an imageCover']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    },       
    startLocation:{
        type:{
        type:String,
        default:'Point',
        enum:['Point']
        },
        coordinates:[Number],
        adress:String,
        description:String
    },
    locations:[
        {
type:{
    type:String,
    default:'Point',
    enum:['Point']
},
coordinates:[Number],
adress:String,
description:String,
day:Number
        }
    ],
    guides:[
{
    type : mongoose.Schema.ObjectId,
    ref: 'User'
  }
]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
})
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})
tourSchema.pre(/^find/, function(next) {
  
    this.populate({
      path: 'guides',
      select: '-__v'
    })
    // }).select('-__v');
  
    next();
  });
tourSchema.index({price:1,ratingsAverage:-1});
tourSchema.index({slug:1});
tourSchema.index({startLocation: '2dsphere'});

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
tourSchema.pre(/^find/,function(next){
    this.find({
    secretTour:{$ne:true}
})
this.start=Date.now();
    next();
})
tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v'
    });
    next();
})
tourSchema.post(/^find/,function(docs,next){

    next();
})
const Tour=mongoose.model('Tour' , tourSchema);
module.exports=Tour;