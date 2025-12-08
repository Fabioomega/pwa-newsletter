const path = require("path");
const express = require("express");

const app = express();

// midlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const usersRouter = require('./src/routes/users.routes');
const authRouter = require('./src/routes/auth.routes');

app.use("/users", usersRouter);
app.use("/auth", authRouter);


app.listen(8080, function () {
  console.log("Servidor rodando na porta 8080...");
});
