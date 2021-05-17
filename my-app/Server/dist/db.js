"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_user = exports.display_users = exports.connect = exports.loginUser = void 0;
const dotenv = __importStar(require("dotenv"));
console.log(dotenv.config());
const mongoose = __importStar(require("mongoose"));
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
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Connecting");
        mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            // we're connected!
            console.log("connected");
        });
    });
}
exports.connect = connect;
function display_users() {
    return __awaiter(this, void 0, void 0, function* () {
        User.find((err, res) => {
            if (err)
                return console.log(err);
            console.log(res);
            return res;
        });
    });
}
exports.display_users = display_users;
function register_user(getUser, getPass) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = new User({
            username: getUser,
            password: getPass
        });
        try {
            let data = yield newUser.save((err, myUser) => {
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
    });
}
exports.register_user = register_user;
function loginUser(user, pass) {
    return __awaiter(this, void 0, void 0, function* () {
        const logUser = new User({
            username: user,
            password: pass
        });
        try {
            let data = yield User.findOne({ username: user });
            if (!data) {
                throw new Error('no document found');
            }
            return data;
        }
        catch (error) {
            return 0;
        }
    });
}
exports.loginUser = loginUser;
//# sourceMappingURL=db.js.map