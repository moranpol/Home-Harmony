import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  host: "home-harmony-db.cem2euk08pqo.us-east-1.rds.amazonaws.com",
  username: "postgres",
  port: 5432,
  password: "Mta159753!",
  database: "homeHarmonyDB",
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
