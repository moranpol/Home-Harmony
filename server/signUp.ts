import express from "express";
import DataSource from "./database/databasepg";
//import fs from "fs";
import { Amplify } from "aws-amplify";
import { enviorment } from "./enviorments/enviorment";
import { signUp, confirmSignUp } from "aws-amplify/auth";
 
const signUpRouter = express.Router();
 
Amplify.configure({
  Auth: { Cognito: enviorment.Cognito },
});
 
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
    res.status(500).json({ success: false, error: "Confirmation failed"  });
  }
});
 
signUpRouter.post("/", async (req, res) => {
  const registerInfo = req.body;
 
  try {
    // const imagePath = registerInfo.photo;
    // const imageBuffer = fs.readFileSync(imagePath);
    // todo - add image to S3 and somthing called multer
    await signUp({
      username: registerInfo.email,
      password: registerInfo.password,
    });
 
    const query = `insert into usersTable (fname, lname, email, birthdate, password) values ('${registerInfo.firstName}', '${registerInfo.lastName}', '${registerInfo.email}', '${registerInfo.birthday}', '${registerInfo.password}')`;
    await DataSource.createQueryRunner().manager.query(query);
 
    const idQuery = `select id from usersTable where email = '${registerInfo.email}'`;
    const userId = await DataSource.createQueryRunner().manager.query(idQuery);
   
    res
      .status(200)
      .json({
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
 