const express = require("express");
const router = express.Router();

const MySQLFunctions = require("../utils/SQLFunctions");
const manageProducts = new MySQLFunctions("productos");

router.get("/", (req, res) => {
  res.render("home");
});

//obtener todos los productos:
router.get("/productos", async (req, res) => {
  const LISTA_PRODUCTOS = await manageProducts.getAll();
  res.render("productos", { productos: LISTA_PRODUCTOS });
});

//Agregar un producto:
router.post("/productos", async (req, res) => {
  const { title, price, thumbnail } = req.body;

  const LISTA_PRODUCTOS = await manageProducts.getAll();

  const productoCheck = LISTA_PRODUCTOS.filter((item) => item.title === title);
  if (productoCheck.length !== 0) {
    return res
      .status(400)
      .json({ error: "El producto ya se encuentra en la base de datos" });
  }

  if (!title.trim() || !price.trim() || !thumbnail.trim()) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  //probemos la sql:
  await manageProducts.create(req.body);
  // await manageProducts.closeConnection();

  res.redirect("/");
});

module.exports = router;
