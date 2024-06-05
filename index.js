require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParse = require('cookie-parser');
const errorMiddleware = require('./middlewares/errorMiddlewares');
const PORT = process.env.PORT || 5000;

const app = express();

// routes
const authRoutes = require("./routes/authRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParse());
app.use(
    cors({
      credentials: true,
      origin: "*",
    })
  );

// use routes

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);  

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
          });
    } catch (error) {
        console.log(error);
    }
}

start();


