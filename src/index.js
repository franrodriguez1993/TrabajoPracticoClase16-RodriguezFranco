const express = require("express");
const storageManager = require("./helpers/StorageManager");
// const storageMessages = new storageManager("mensajes.txt");

//Manejador mySql productos:
const MySQLFunctions = require("./utils/SQLFunctions");
const manageProducts = new MySQLFunctions("productos");

//Manejador SQLite3 mensajes:
const SQLite3Functions = require("./utils/SQLite3Functions");
const manageMessages = new SQLite3Functions("mensajes");

//Handlebars:
const { create } = require("express-handlebars");

//Websocket:
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// Motor de plantillas:
const hbs = create({
  extname: ".hbs",
  partialsDir: ["src/views/components"],
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "src/views");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Ruta:
app.use("/", require("./routes/productos.routes"));

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log("App en http://localhost:" + PORT);
});

//Sockets:
io.on("connection", async (socket) => {
  console.log("Nuevo usuario conectado", socket.id);
  //
  //Enviando productos al hacer login:
  const productList = await manageProducts.getAll();
  await productList.reverse();
  io.sockets.emit("newProducts", productList);
  //
  //Enviando mensajes al hacer login:
  const messagesList = await manageMessages.getAll();
  // const messagesList = await storageMessages.getAll();
  await messagesList.reverse();
  io.sockets.emit("messages", messagesList);
  //
  //Productos nuevos:
  socket.on("productAdded", async () => {
    io.sockets.emit("newProducts", productList);
  });
  //
  //Mensajes nuevos:
  socket.on("new-msg", async (data) => {
    await manageMessages.create(data);
    // await storageMessages.save(data);
    io.sockets.emit("messages", messagesList);
  });
});
