const express = require('express');
const bodyParser = require('body-parser');
const path=require('path')
const mongoose = require('mongoose');
const multer=require('multer')
const {v4:uuid4 } = require('uuid');
const helmet= require('helmet')
const compression =require('compression')
const feedRoutes=require('./routes/contacts')
const authRoutes=require('./routes/auth')
const cors=require('cors')

require('dotenv').config();

const app = express();
app.use(cors())
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, uuid4() + file.originalname)
  }
});

const fileFilter=(req,file,cb)=>{
  if(
  file.mimetype==='image/png' ||
  file.mimetype==='image/jpg' ||
  file.mimetype==='image/jpeg'
  ){
    cb(null,true)
  }else{
    cb(null,false)
  }
}

app.use(bodyParser.json());
app.use(multer({storage:storage,fileFilter:fileFilter}).single('image'))
app.use('/images',express.static(path.join(__dirname,'images')))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});



app.use('/book', feedRoutes);
app.use('/auth',authRoutes)

// app.use(helmet())
app.use(compression())


app.use((error,req,res,next)=>{
 
  const status=error.statusCode || 500
  const message=error.message
  const data=error.data
  res.status(status).json({
    message:message,
    data:data
  })
})
app.use(express.static(path.join(__dirname,'public')))
app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'))
})

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.wkaijzr.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
   const server= app.listen(process.env.PORT || 8080);
    const io=require('./socket').init(server)
    io.on('connection',socket=>{
      console.log('Client connected')
    })
    console.log('connect');
  })
  .catch((err) => {
    console.log(err);//add comment
  });
