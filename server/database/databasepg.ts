import { DataSource } from "typeorm";

let mainDataSource =  new DataSource({
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

mainDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

let queryRunner = mainDataSource.createQueryRunner();

export default queryRunner;
