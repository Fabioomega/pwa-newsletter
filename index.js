const path = require("path");
const express = require("express");
const cors = require('cors');
const connectDB = require('./src/config/connection');

const cookieParser = require('cookie-parser');
const app = express();

// midlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

const usersRouter = require('./src/routes/users.routes');
const authRouter = require('./src/routes/auth.routes');
const newsRouter = require('./src/routes/news.routes');
const pagesRouter = require('./src/routes/pages.routes');

app.use('/page', pagesRouter);
app.use('/news', newsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

connectDB();

app.listen(8080, function () {
  console.log("Servidor rodando na porta 8080...");
});
