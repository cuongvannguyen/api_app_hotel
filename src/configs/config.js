require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    define: {
      freezeTableName: true,
    },
    logging: false,
    timezone: "+07:00",
    // timestamp: false,
  },

  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },

  production: {
    username: "newstage",
    password: "newstage123#@!",
    database: "JWT_DB",
    host: "172.29.2.91",
    dialect: "mysql",
    define: {
      freezeTableName: true,
    },
    logging: false,
  },
};
