const express = require("express");
const morgan = require("morgan");
// const hpp = require('hpp');
const cors = require("cors");
const bodyParser = require("body-parser");

const dashRoutes = require("./routes/dashRoutes");
const homeRoutes = require("./routes/homeRoutes");
const editProfileRoutes = require("./routes/editProfileRoutes");
const userRoutes = require("./routes/userRoutes");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

app.use(bodyParser.json({ type: "*/*" }));
app.use(cors());
app.use(morgan("dev"));

// prevent parameter pollution with hpp after...

app.use("/dashboard", dashRoutes);
app.use("/user", editProfileRoutes);
app.use("/home", homeRoutes);
app.use("/image", imageRoutes);
app.use("/authenticate", userRoutes);

app.all("*", (req, res, next) => {
  next(new appError(`can't find ${req.originalUrl} in the server`));
});

app.use(globalErrorHandler);
module.exports = app;
