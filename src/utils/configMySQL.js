const path = require("path");

const configMySQL = {
  db: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "franco",
      password: "franco",
      database: "ecommerce",
    },
  },
};

const configSQLite3 = {
  db: {
    client: "better-sqlite3",
    connection: {
      filename: path.join(__dirname, "../database/ecommerce.sqlite"),
    },
    useNullAsDefault: true,
  },
};

module.exports = { configMySQL, configSQLite3 };
