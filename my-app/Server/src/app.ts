import { connect, display_users, register_user, loginUser } from "./db"
import getMemes from "./Routes/hot_display"
import * as registerRouter from './Routes/register';
import express from "express"
import 'dotenv/config'
import bodyParser from "body-parser"
import  cors from "cors"
import jwt from "jsonwebtoken"
import { send } from "process";
import fs from 'fs'
import multer from 'multer'
import pkgcloud from 'pkgcloud'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = 4000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

const key_jwt = process.env.SECRET_TOKEN


app.get('/', (req, res) => {
  res.send('Hello World')
});

app.use(cors())




app.route('/upload').post(upload.single('image'),(req,res,next: any) => {
  const files: any = req.files
  const fileList = files['image']
  console.log(fileList)
  if(fileList != undefined && fileList.length>0){
      for(var i=0;i<fileList.length;i++){
          const bufferImage = Buffer.from(fileList[i]['data'].buffer)
          const filename = fileList[i]['name']
          fs.writeFile(filename,bufferImage,'base64',function(err){
              if(err){
                  console.log(err)
              } else {
                  uploadBlobStorage(filename,new String(containerName).toString())
                  console.log(`file ${filename} uploaded successfully !!!`)
              }
          })            
      }
      res.send(`images uploaded successfully !!!`)       
  }
})

async function uploadBlobStorage(filename: string,containerName: string){

  var client = pkgcloud.storage.createClient({
      provider: 'azure',
      storageAccount:  process.env.AZURE_STORAGE_ACCOUNT_NAME,
      storageAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
  });
    
  var readStream = fs.createReadStream(filename);
  var writeStream = client.upload({
      container: containerName,
      remote: filename
  });
    
  writeStream.on('error', function (err) {
      console.log("failed to upload file in azure storage : ",err);
  });
    
  writeStream.on('success', function (file) {
      console.log(file," uploaded successfully");
      
  });
    
  readStream.pipe(writeStream);

};


app.post('/login', async (req, res) => {

  const username = req.body.credentials.username
  const password = req.body.credentials.password

  const result = await loginUser(username,password)

  function validateUser(result) {

    if (result === 0) {
      console.log("User doesn't exist")
      return 0
    }

    if (password === result.password) {
     // Login Success 
      console.log("Login Success")
      const token = jwt.sign({ id: result._id }, key_jwt);
      res.send(token)
      console.log(token)
      return 1 

    } else {
      console.log("Password not matching ")
      return 0
    }
  }
  validateUser(result)
});


const authentification = (req, res, next) => {
  try {
    const { token } = req.query
    var decoded = jwt.verify(token, key_jwt);
    console.log("ok");
    //res.send("token ok")
    next()

  } catch (err) {
    console.log(err);
    res.send("token fail")
  }
}
//route qui redirige vers le profil
app.get("/profil", authentification,(req, res) => {

  console.log("profil")
  res.send("profil")

})

//exemple de route
app.post("/privee", authentification,(req, res)=> {
  console.log("privee");
  res.send("privee")
  
})

/*
app.get("/users", (req, res) => {
  res.send(display_users())
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.post("/register", (req, res) => {
  
  const username = req.body.credentials.username
  const password = req.body.credentials.password

  register_user(username,password)
})

*/
app.get("/memes", getMemes)

app.listen(PORT, () => {
  // connect()
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
