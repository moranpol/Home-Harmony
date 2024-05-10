import express from "express";
import DataSource from "./database/databasepg";
import fs from "fs";
const signUpRouter = express.Router();

signUpRouter.post("/register", async (req, res) => {
  const registerInfo = req.body;

  if (await isFormValid(registerInfo.email)) {
    try {
      // const imagePath = registerInfo.photo;
      // const imageBuffer = fs.readFileSync(imagePath);
      // todo - add image to S3 and somthing called multer
      const query = `insert into usersTable (fname, lname, email, birthdate, password) values ('${registerInfo.fname}', '${registerInfo.lname}', '${registerInfo.email}', '${registerInfo.birthday}', '${registerInfo.password}')`;
      await DataSource.createQueryRunner().manager.query(query);
      res.status(200).json({ success: true, message: "Registration success" });
    } catch (error) {
      console.log("Registration failed", error);
      res.status(500).json({ success: false, error: "Registration failed" });
    }
  } else {
    res.status(400).json({
      success: false,
      error: "Email already exist, sign in or try another email.",
    });
  }
});

async function isFormValid(email: string): Promise<boolean> {
  const query = `SELECT * FROM usersTable u WHERE u.email = '${email}'`;
  const result = await DataSource.createQueryRunner().manager.query(query);
  return result.length === 0;
}

export default signUpRouter;
