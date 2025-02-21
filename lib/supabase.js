import knex from "knex";

const DB = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});
export default DB;