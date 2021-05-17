"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_user = exports.display_users = exports.connect = exports.loginUser = void 0;
const dotenv = require("dotenv");
console.log(dotenv.config());
const mongoose = require("mongoose");
const userCollection = "users";
const uniqueValidator = require('mongoose-unique-validator');
const MONGOURI = `mongodb://souadmango:STlwoU6R614bvNKEtntN2bmjeXYKqWRXUK8MksCYUQ7ZvBiAMF0R0u5fpR84KsgkvHUYIeXFkR1P93fp1M2WNw==@souadmango.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@souadmango@`;
//process.env.MONGOURI
const collection = "database1";
const SALT_WORK_FACTOR = 10;
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true }
});
userSchema.plugin(uniqueValidator, { message: 'is already taken.' });
const User = mongoose.connection.models[userCollection] || mongoose.model(userCollection, userSchema);
/// 
async function connect() {
    console.log("Connecting");
    mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        // we're connected!
        console.log("connected");
    });
}
exports.connect = connect;
async function display_users() {
    User.find((err, res) => {
        if (err)
            return console.log(err);
        console.log(res);
        return res;
    });
}
exports.display_users = display_users;
async function register_user(getUser, getPass) {
    const newUser = new User({
        username: getUser,
        password: getPass
    });
    try {
        let data = await newUser.save((err, myUser) => {
            if (err) {
                throw new Error('User already existe');
            }
            //////
            console.log(myUser);
            console.log("New user registered");
        });
    }
    catch (error) {
        return 0;
    }
}
exports.register_user = register_user;
async function loginUser(user, pass) {
    const logUser = new User({
        username: user,
        password: pass
    });
    try {
        let data = await User.findOne({ username: user });
        if (!data) {
            throw new Error('no document found');
        }
        return data;
    }
    catch (error) {
        return 0;
    }
}
exports.loginUser = loginUser;
//# sourceMappingURL=db.js.map