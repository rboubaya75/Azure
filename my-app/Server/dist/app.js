"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { connect, display_users, register_user, loginUser } from "./db"
const hot_display_1 = __importDefault(require("./Routes/hot_display"));
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const pkgcloud_1 = __importDefault(require("pkgcloud"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
const PORT = 4000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_fileupload_1.default());
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({ storage: storage });
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const key_jwt = process.env.SECRET_TOKEN;
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use(cors_1.default());
app.route('/upload').post(upload.single('image'), (req, res, next) => {
    const files = req.files;
    const fileList = files['image'];
    console.log(fileList);
    if (fileList != undefined && fileList.length > 0) {
        for (var i = 0; i < fileList.length; i++) {
            const bufferImage = Buffer.from(fileList[i]['data'].buffer);
            const filename = fileList[i]['name'];
            fs_1.default.writeFile(filename, bufferImage, 'base64', function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    uploadBlobStorage(filename, new String(containerName).toString());
                    console.log(`file ${filename} uploaded successfully !!!`);
                }
            });
        }
        res.send(`images uploaded successfully !!!`);
    }
});
function uploadBlobStorage(filename, containerName) {
    return __awaiter(this, void 0, void 0, function* () {
        var client = pkgcloud_1.default.storage.createClient({
            provider: 'azure',
            storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
            storageAccessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
        });
        var readStream = fs_1.default.createReadStream(filename);
        var writeStream = client.upload({
            container: containerName,
            remote: filename
        });
        writeStream.on('error', function (err) {
            console.log("failed to upload file in azure storage : ", err);
        });
        writeStream.on('success', function (file) {
            console.log(file, " uploaded successfully");
        });
        readStream.pipe(writeStream);
    });
}
;
/*
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
app.get("/memes", hot_display_1.default);
app.listen(PORT, () => {
    // connect()
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map