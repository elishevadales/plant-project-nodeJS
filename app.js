const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const fileUpload = require("express-fileupload")
const {config} = require("./config/secret")

const {routesInit} = require("./routes/config_routes")
require("./db/mongoconnect");

const app = express();

app.use(cors());
//limit the sfile size to 2mb
//free - 500mb
app.use(fileUpload({limits:{fileSize: 1024 * 1024 * 2 }}))
app.use(express.json());
// הגדרת תקיית הפאבליק כתקייה ראשית
app.use(express.static(path.join(__dirname,"public")))

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || config.defaultPort
server.listen(port);