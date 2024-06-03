import express from "express";
import queryRunner from "./database/databasepg";

const navigateBarRouter = express.Router();

navigateBarRouter.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const query = `SELECT u.fname, apt.address FROM apartmentsTable apt JOIN userstable u ON apt.id = u.aptid WHERE u.id = ${userId};`;
    const result = await queryRunner.query(query);
    const navigateBarInfo = {
      address: result[0].address,
      userName: result[0].fname,
    };
    res.status(200).json(navigateBarInfo);
  } catch (err) {
    console.error("Failed to fetch navigate bar:", err);
    res.status(500).send("Failed to fetch navigate bar");
  }
});

export default navigateBarRouter;
