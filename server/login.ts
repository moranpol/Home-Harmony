import express from "express";
import queryRunner from "./database/databasepg";
import { Amplify} from "aws-amplify";
import { enviorment } from "./enviorments/enviorment";
import { signIn} from "aws-amplify/auth";

const router = express.Router();

Amplify.configure({
  Auth: { Cognito: enviorment.Cognito },
});


router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    await signIn({ username: email, password: password });
    const userId = await getId(email);
    const isManager = await getIsManager(userId);
    console.log("Login successful, userId: ", userId);
    res.status(200).json({ success: true, message: "Login successful", userId: userId, isManager: isManager});
  } catch (error) {
    console.error("Login error:", error);
    console.log("error: ", error);
    res.status(401).json({ success: false, message: "Invalid email or password",email,password,error });
  }
});

async function getId(email: string): Promise<number> {
  const query = `SELECT u.id FROM usersTable u WHERE u.email = '${email}'`;
  const result = await queryRunner.query(query);
  return result[0]?.id;
}

async function getIsManager(userId: Number): Promise<boolean> {
  const query = `SELECT EXISTS (
    SELECT 1
    FROM apartmentstable
    WHERE managerid = '${userId}');`;
  const result = await queryRunner.query(query);
  return result[0]?.exists;
  
  
}

export default router;
