const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../model/tourModel.Js');
const Review = require('../../model/reviewModel');
const User=require('./../../model/userModal.Js');
dotenv.config({ path: './config.env' });

mongoose.connect('mongodb+srv://hekurankokolli:Mi0MwNd61YgyyUXv@cluster0.d2dn0di.mongodb.net/natours?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology:true
})

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tour.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/user.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/review.json`, 'utf-8')
);
// IMPORT DATA INTO DB
const importData = async () => {
  try {
      await User.create(users,{validateBeforeSave:false});
    await Tour.create(tours);
  
    await Review.create(reviews)
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    console.log(User);
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
console.log(process.argv[2]);
if (process.argv[2] === '--import') {
  console.log(2);
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}