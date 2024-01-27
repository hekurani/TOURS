const express=require('express');
const app=express();
const corse=require('cors');
const path=require('path');
const cookieParser=require('cookie-parser')
app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'));
const morgan=require('morgan');
const tourRouter=require('./Router/tour-routes');
const userRouter=require('./Router/user-routes');
const bookingRouter=require('./Router/bookingRoutes')
const AppError=require('./../Project2/utils/appError.Js');
const globalErrorHandler=require('./controllers/errorControler.Js');
const rateLimit=require('express-rate-limit');
const helmet = require('helmet')
const bodyParser=require('body-parser')
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const viewRouter=require('./Router/view-routes');
const reviewRouter=require('./Router/review-routes');
const limiter = rateLimit({
    max:100,
    windowsMs:60*60*1000,
    message:'Too many requests from this IP, please try again in one hour'
})
app.use(corse({
  origin: 'http://localhost:3003',
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser("yoursecretkey"));
app.use(express.urlencoded({ extended: true,limit:'10kb'}));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      frameSrc: ["'self'", 'https://js.stripe.com'],
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://unpkg.com', 'https://js.stripe.com/v3/', 'https://js.stripe.com/terminal/v1/', 'https://ajax.googleapis.com', 'https://maxcdn.bootstrapcdn.com', 'unsafe-inline'],
      connectSrc: ["'self'", 'https://reqres.in', 'http://127.0.0.1:3003'],
    },
  })
);
app.use(hpp({
    whiteList:['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}));
//MiddleWares
app.use(morgan('dev'));
app.use(express.json({limit: '10kb' }));//middleware is an function between request and response and has 3 parameters rew,res,next but at the end you have to call the next   midleware ne mes response dhe request dhe ne menyre per te pare data ne request

//Data sanitization against NOSQL query injections
//"role":>0
app.use(mongoSanitize());
//data Sanitization against XSS
app.use(xss());


app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
})


//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tour',tourRouter);
app.use('/api/v1/user',userRouter); 
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/booking',bookingRouter);


app.all('*',(req,res,next)=>{
next(new AppError(`Cant find the ${req.originalUrl} on the server`,404));
}) 
 app.use(globalErrorHandler);    
module.exports = app;