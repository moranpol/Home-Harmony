import express from "express";
import loginRouter from "./login";
import signUpRouter from "./signUp";
import expensesRouter from "./expenses";
import documentsRouter from "./documents";
import DataSource from "./database/databasepg";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use("/login", loginRouter);
app.use("/register", signUpRouter);
app.use("/expenses", expensesRouter);
app.use("/documents", documentsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  DataSource.initialize()
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
    });
});
