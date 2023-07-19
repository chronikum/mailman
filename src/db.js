import knex from "knex";

const db = knex({
  client: process.env.MAILMAN_DB_ENGINE || "mysql",
  connection: {
    host: process.env.MAILMAN_DB_HOST || "127.0.0.1",
    user: process.env.MAILMAN_DB_USER,
    password: process.env.MAILMAN_DB_PASSWORD,
    database: 'vmail'
  }
});

export default db;
