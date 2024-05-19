import express from "express";
import DataSource from "./database/databasepg";
import multer from "multer";
import { Request } from 'express';
import { Amplify } from "aws-amplify";
import { StorageEngine } from 'multer';
import { enviorment } from "./enviorments/enviorment";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import path from "path";
import fs from "fs";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const signUpRouter = express.Router();

Amplify.configure({
  Auth: { Cognito: enviorment.Cognito },
});

const profileImageDir = path.join(
  __dirname,
  "..",
  "document-home-harmony",
  "profile-image"
);

if (!fs.existsSync(profileImageDir)) {
  fs.mkdirSync(profileImageDir, { recursive: true });
}

type DestinationFunction = (
  error: Error | null,
  destination: string
) => void;

type FileNameFunction = (
  error: Error | null,
  filename: string
) => void;

interface DiskStorage extends StorageEngine {
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationFunction
  ) => void;
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameFunction
  ) => void;
}

const storage: DiskStorage = {
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationFunction
  ) => {
    cb(null, profileImageDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameFunction
  ) => {
    const userId = req.body.userId;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${userId}-${file.fieldname}-${uniqueSuffix}${extension}`);
  },
  _handleFile: function (req: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File> | undefined) => void): void {
    throw new Error("Function not implemented.");
  },
  _removeFile: function (req: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error: Error | null) => void): void {
    throw new Error("Function not implemented.");
  }
};

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

    const query = `insert into usersTable (fname, lname, email, birthdate, password) values ('${registerInfo.firstName}', '${registerInfo.lastName}', '${registerInfo.email}', '${registerInfo.birthday}', '${registerInfo.password}')`;
    await DataSource.createQueryRunner().manager.query(query);

    const idQuery = `select id from usersTable where email = '${registerInfo.email}'`;
    const userId = await DataSource.createQueryRunner().manager.query(idQuery);

    res.status(200).json({
      success: true,
      message: "Registration success",
      userId: userId[0].id,
    });
  } catch (error: any) {
    console.log("Registration failed", error);

    if (error.name === "UsernameExistsException") {
      res
        .status(400)
        .json({ success: false, error: "User with this mail already exist" });
    } else if (error.name === "InvalidParameterException") {
      res.status(401).json({ success: false, error: "Invalid mail" });
    } else if (error.name === "InvalidPasswordException") {
      res.status(401).json({ success: false, error: "Invalid password" });
    } else {
      res.status(500).json({ success: false, error: "Registration failed" });
    }
  }
});

export default signUpRouter;
