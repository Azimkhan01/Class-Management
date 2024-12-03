const express = require("express");
const path = require("path");
const colors = require("colors");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const { router } = require("./Routers/SignupRoutes");
const partialsPath = path.join(__dirname, "views/Partials");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);
app.use("/", router);
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(
    colors.bgBlue(`Worker ${process.pid} listening at http://127.0.0.1:${port}`)
  );
});

module.exports = app;
