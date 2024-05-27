import express from "express";
import DataSource from "./database/databasepg";
import { Amplify} from "aws-amplify";
import { enviorment } from "./enviorments/enviorment";
import { signIn} from "aws-amplify/auth";

const router = express.Router();

Amplify.configure({
  Auth: { Cognito: enviorment.Cognito },
});

/*
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (await validateLogin(email, password)) {
    const userId = await getId(email);
    res
      .status(200)
      .json({ success: true, message: "Login successful", userId });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }
});
*/
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    await signIn({ username: email, password: password });
    const userId = await getId(email);
    console.log("Login successful, userId: ", userId);
    res.status(200).json({ success: true, message: "Login successful", userId: userId});
  } catch (error) {
    console.error("Login error:", error);
    console.log("error: ", error);
    res.status(401).json({ success: false, message: "Invalid email or password",email,password,error });
  }
});

async function validateLogin1(
  email: string,
  password: string
): Promise<boolean> {
  const query = `SELECT u.password FROM usersTable u WHERE u.email = '${email}'`;
  const result = await DataSource.createQueryRunner().manager.query(query);
  const password_from_table = result[0]?.password;
  return password === password_from_table;
}

/*
async function validateLogin2(
  email: string,
  password: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(true);
      },
      onFailure: (err) => {
        console.error(err);
        resolve(false);
      },
    });
  });
}
*/

async function getId(email: string): Promise<number> {
  const query = `SELECT u.id FROM usersTable u WHERE u.email = '${email}'`;
  const result = await DataSource.createQueryRunner().manager.query(query);
  return result[0]?.id;
}
export default router;
