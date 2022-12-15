const indexR = require("./index");
const usersR = require("./users");
const plantsR = require("./plants");
const uploadR = require("./upload");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/plants",plantsR);
  app.use("/upload",uploadR);
}