//CREANDO LA TABLA DE PRODUCTOS CON MYSQL:

const knex = require("knex");
const { configMySQL } = require("../utils/configMySQL");

const knexCli = knex(configMySQL.db);

knexCli.schema.dropTableIfExists("productos").then(() => {
  knexCli.schema
    .createTable("productos", (table) => {
      table.increments("id").primary();
      table.string("title", 50).notNullable();
      table.integer("price").notNullable();
      table.string("thumbnail", 100).notNullable();
    })
    .then(() => console.log("Tabla creada."))
    .catch((err) => {
      console.log(err);
      throw err;
    })
    .finally(() => {
      knexCli.destroy();
    });
});
