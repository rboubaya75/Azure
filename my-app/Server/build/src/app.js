"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const hot_display_1 = require("./Routes/hot_display");
const express_1 = require("express");
require("dotenv/config");
const body_parser_1 = require("body-parser");
const cors_1 = require("cors");
const jsonwebtoken_1 = require("jsonwebtoken");
const fs_1 = require("fs");
const multer_1 = require("multer");
const pkgcloud_1 = require("pkgcloud");
const express_fileupload_1 = require("express-fileupload");
const dotenv_1 = require("dotenv");
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
async function uploadBlobStorage(filename, containerName) {
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
}
;
app.post('/login', async (req, res) => {
    const username = req.body.credentials.username;
    const password = req.body.credentials.password;
    const result = await db_1.loginUser(username, password);
    function validateUser(result) {
        if (result === 0) {
            console.log("User doesn't exist");
            return 0;
        }
        if (password === result.password) {
            // Login Success 
            console.log("Login Success");
            const token = jsonwebtoken_1.default.sign({ id: result._id }, key_jwt);
            res.send(token);
            console.log(token);
            return 1;
        }
        else {
            console.log("Password not matching ");
            return 0;
        }
    }
    validateUser(result);
});
const authentification = (req, res, next) => {
    try {
        const { token } = req.query;
        var decoded = jsonwebtoken_1.default.verify(token, key_jwt);
        console.log("ok");
        //res.send("token ok")
        next();
    }
    catch (err) {
        console.log(err);
        res.send("token fail");
    }
};
//route qui redirige vers le profil
app.get("/profil", authentification, (req, res) => {
    console.log("profil");
    res.send("profil");
});
//exemple de route
app.post("/privee", authentification, (req, res) => {
    console.log("privee");
    res.send("privee");
});
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