require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      charset: "utf8mb4",
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      charset: "utf8mb4",
    },
  },
};
