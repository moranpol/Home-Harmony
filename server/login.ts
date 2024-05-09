import express from "express";
import DataSource from "./database/databasepg";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (await validateLogin(email, password)) {
    const userId = await getId(email);
    res.status(200).json({ success: true, message: "Login successful", userId });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }
});

async function validateLogin(
  email: string,
  password: string
): Promise<boolean> {
  const query = `SELECT u.password FROM usersTable u WHERE u.email = '${email}'`;
  const result = await DataSource.createQueryRunner().manager.query(query);
  const password_from_table = result[0]?.password;
  return password === password_from_table;
}

async function getId(email: string): Promise<number> {
  const query = `SELECT u.id FROM usersTable u WHERE u.email = '${email}'`;
  const result = await DataSource.createQueryRunner().manager.query(query);
  return result[0]?.id;
}
export default router;
