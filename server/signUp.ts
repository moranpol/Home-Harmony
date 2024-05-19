import express from "express";
import DataSource from "./database/databasepg";
import multer from "multer";
import { Request } from "express";
import { Amplify } from "aws-amplify";
import { enviorment } from "./enviorments/enviorment";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import path from "path";
import fs from "fs";

const signUpRouter = express.Router();

Amplify.configure({
  Auth: { Cognito: enviorment.Cognito },
});

const rootDir = path.parse(process.cwd()).root;
const profileImageDir = path.join(rootDir, "document-home-harmony", "profile-image");

if (!fs.existsSync(profileImageDir)) {
  fs.mkdirSync(profileImageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, profileImageDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

signUpRouter.post("/confirm", async (req, res) => {
  const confirmationInfo = req.body;
  const query = `SELECT u.email FROM usersTable u WHERE u.id = '${confirmationInfo.userId}'`;
  const email = await DataSource.createQueryRunner().manager.query(query);

  try {
    await confirmSignUp({
      username: email[0].email,
      confirmationCode: confirmationInfo.confirmationCode,
    });
    res.status(200).json({ success: true, message: "Confirmation success" });
  } catch (error: any) {
    console.log("Confirmation failed", error);
    res.status(500).json({ success: false, error: "Confirmation failed" });
  }
});

signUpRouter.post("/", upload.single("image"), async (req, res) => {
  const registerInfo = req.body;

  try {
    await signUp({
      username: registerInfo.email,
      password: registerInfo.password,
    });

    const query = `INSERT INTO usersTable (fname, lname, email, birthdate, password) VALUES ('${registerInfo.firstName}', '${registerInfo.lastName}', '${registerInfo.email}', '${registerInfo.birthday}', '${registerInfo.password}') RETURNING id`;
    const result = await DataSource.createQueryRunner().manager.query(query);
    const userId = result[0].id;

    if (req.file) {
      const oldPath = req.file.path;
      const newFilename = `${userId}.png`;
      const newPath = path.join(profileImageDir, newFilename);
      fs.renameSync(oldPath, newPath);
      req.file.path = newPath;
    }

    res.status(200).json({
      success: true,
      message: "Registration success",
      userId: userId,
    });
  } catch (error: any) {
    console.log("Registration failed", error);

    if (error.name === "UsernameExistsException") {
      res.status(400).json({ success: false, error: "User with this email already exists" });
    } else if (error.name === "InvalidParameterException") {
      res.status(401).json({ success: false, error: "Invalid email" });
    } else if (error.name === "InvalidPasswordException") {
      res.status(401).json({ success: false, error: "Invalid password" });
    } else {
      res.status(500).json({ success: false, error: "Registration failed" });
    }
  }
});

export default signUpRouter;
