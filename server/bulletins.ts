import express from "express";
import queryRunner from "./database/databasepg";

const bulletinsRouter = express.Router();

interface Bulletin {
  id: number;
  userName: string;
  info: string;
  date: Date;
}

bulletinsRouter.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const query = `SELECT b.id, uc.fname, uc.lname, b.info, b.date FROM bulletinstable b JOIN userstable u ON b.aptid = u.aptid JOIN userstable uc ON b.userid = uc.id WHERE u.id = ${userId} ORDER BY b.date DESC;`;
    const result = await queryRunner.query(query);
    const bulletins: Bulletin[] = result.map((bulletin: any) => ({
      id: bulletin.id,
      userName: bulletin.fname + " " + bulletin.lname,
      info: bulletin.info,
      date: bulletin.date,
    }));
    res.status(200).json(bulletins);
  } catch (err) {
    console.error("Failed to fetch bulletins:", err);
    res.status(500).send("Failed to fetch bulletins");
  }
});

bulletinsRouter.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const query = `DELETE FROM bulletinstable WHERE id = ${id};`;
    await queryRunner.query(query);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to delete bulletin:", err);
    res.status(500).send("Failed to delete bulletin");
  }
});

bulletinsRouter.post("/create", async (req, res) => {
  try {
    const { info, date, userId } = req.body;
    const query = `INSERT INTO bulletinstable (info, date, userid, aptid) VALUES ('${info}', '${date}', ${userId}, (SELECT aptid FROM userstable WHERE id = ${userId}));`;
    await queryRunner.query(query);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to create bulletin:", err);
    res.status(500).send("Failed to create bulletin");
  }
});

export default bulletinsRouter;
