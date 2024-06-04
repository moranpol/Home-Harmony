import express from "express";
import loginRouter from "./login";
import signUpRouter from "./signUp";
import apartmentsRouter from "./apartments";
import expensesRouter from "./expenses";
import documentsRouter from "./documents";
import bulletinsRouter from "./bulletins";
import navigateBarRouter from "./navigateBar";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 5000;

const profileImageDir = path.join(__dirname, "document-home-harmony", "profile-image");

if (!fs.existsSync(profileImageDir)) {
  fs.mkdirSync(profileImageDir, { recursive: true });
}

app.use('/profile-images', express.static(profileImageDir));

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
