const path = require("path");
const express = require("express");

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// midlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const usersRouter = require('./src/routes/users.routes');
app.use("/users", usersRouter);

app.listen(8080, function () {
  console.log("Servidor rodando na porta 8080...");
});
