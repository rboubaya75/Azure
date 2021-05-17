"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
function registerRouter(req, res) {
    console.log(req);
    const { username, password } = req.body;
    if (username.length <= 2 || password.length <= 2) {
        return res.status(400).send('Bad username or password');
    }
    console.log({ username, password });
    db_1.register_user(username, password);
    res.status(201).send('User created');
}
exports.default = registerRouter;
//# sourceMappingURL=register.js.map