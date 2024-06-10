import express from "express";
import loginRouter from "./login";
import signUpRouter from "./signUp";
import apartmentsRouter from "./apartments";
import expensesRouter from "./expenses";
import documentsRouter from "./documents";
import bulletinsRouter from "./bulletins";
import navigateBarRouter from "./navigateBar";
import ChoresRouter from "./chores";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();

const PORT = 5000;

const profileImageDir = path.join(__dirname, "..", "app_documents", "profile_image");
const documentDir = path.join(__dirname, "..", "app_documents", "document_files");

if (!fs.existsSync(profileImageDir)) {
  fs.mkdirSync(profileImageDir, { recursive: true });
}
if (!fs.existsSync(documentDir)) {
  fs.mkdirSync(documentDir, { recursive: true });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use("/login", loginRouter);
app.use("/register", signUpRouter);
app.use("/expenses", expensesRouter);
app.use("/documents", documentsRouter);
app.use("/apartments", apartmentsRouter);
app.use("/bulletins", bulletinsRouter);
app.use("/navigate-bar", navigateBarRouter);
app.use("/chores", ChoresRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

