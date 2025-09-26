import jwt from "jsonwebtoken";
import configuration from "./config";

const payload = {
    sub: "equindar",
};

const token = jwt.sign(payload, configuration.app.secret!, {
    expiresIn: "1h",
    issuer: "lunareclipse-api",
});

console.log(token);