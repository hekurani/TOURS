// process.on('uncaughtException',err=>{
//     console.log(err.name,err.message);
//     server.close(()=>{
//         process.exit(1);
//     })
// })
const app=require('./Main.Js');
const path = require('path');
const dotenv = require('dotenv');
const fs=require('fs');
const mongoose=require('mongoose');
const configPath = path.join(__dirname, 'config.env');
dotenv.config({ path: configPath });
fs.readFileSync(configPath, 'utf8');
mongoose.connect('mongodb+srv://hekurankokolli:Mi0MwNd61YgyyUXv@cluster0.d2dn0di.mongodb.net/natours?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("Connected to Database");
})
const port=3003;
const server=app.listen(port,()=>{
    console.log(`listening to port number ${port}`)
})
process.on('unhandledRejection',err=>{
console.log("Uncaught Rejection! Shutting down...");
    console.log(err);
});
process.on('uncaughtException',err=>{
    console.log("Uncaught Exception! Shutting down...");
    console.log(err.name,err.message);
})