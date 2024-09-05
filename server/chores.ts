import express from "express";
import queryRunner from "./database/databasepg";

const choresRouter = express.Router();
choresRouter.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const apartmentId = await getAppartmentId(userId);

    const query = `SELECT c.*, u.fname, u.lname FROM choresTable c JOIN usersTable u ON c.userid = u.id WHERE c.aptid = ${apartmentId}`;
    const result = await queryRunner.query(query);
    const chores: Chore[] = result.map((row: any) => ({
      isDone: row.isdone,
      isRepeat: row.isrepeat,
      repeat: row.repeat,
      startDate: new Date(row.startdate),
      id: row.id,
      fname: row.fname,
      lname: row.lname,
      description: row.description,
      userId: row.userid,
    }));

    for (const chore of chores) {
      await checkAndUpdateChore(chore);
    }
    res.status(200).json({ success: true, chores });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

interface Chore {
  isDone: boolean;
  isRepeat: boolean;
  repeat: string;
  startDate: Date;
  id: number;
  fname: string;
  lname: string;
  description: string;
  userId: number;
}

choresRouter.post("/", async (req, res) => {
  try {
    const { userId, description, isRepeat, repeat } = req.body;

    if (!userId || !description) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const apartmentId = await getAppartmentId(userId);

    if (!apartmentId) {
      return res
        .status(400)
        .json({ success: false, error: "Apartment not found" });
    }

    const startDate = new Date();
    const query = `
      INSERT INTO choresTable (aptid, userid, description, isrepeat, repeat, isdone, startdate)
      VALUES ($1, $2, $3, $4, $5, false, $6)
      RETURNING *`;

    const values = [apartmentId, userId, description, isRepeat, repeat, startDate];
    const result = await queryRunner.query(query, values);

    res.status(201).json({ success: true, chore: result[0] });
  } catch (error: any) {
    console.error("Failed to add chore:", error.message);
    res.status(500).json({ success: false, error: "Failed to add chore" });
  }
});

async function checkAndUpdateChore(chore: Chore) {
  if (chore.isDone && chore.isRepeat) {
    const currentDate = new Date();
    const startDate = new Date(chore.startDate);

    if (
      chore.repeat === "monthly" &&
      currentDate.getMonth() !== startDate.getMonth() &&
      currentDate.getDate() === startDate.getDate()
    ) {
      chore.isDone = false;
    } else if (
      chore.repeat === "weekly" &&
      currentDate.getDay() === startDate.getDay() &&
      Math.abs(currentDate.getTime() - startDate.getTime()) >=
        7 * 24 * 60 * 60 * 1000
    ) {
      chore.isDone = false;
    }

    if (!chore.isDone) {
      const updateQuery = `UPDATE choresTable SET isDone = false WHERE id = ${chore.id}`;
      await queryRunner.query(updateQuery);
    }
  }
}

async function getAppartmentId(userId: number): Promise<number> {
  const query = `SELECT u.aptid FROM userstable u WHERE u.id = '${userId}'`;
  const result = await queryRunner.query(query);
  console.log("aptId: ", result[0]?.aptid);
  return result[0]?.aptid;
}

choresRouter.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid chore ID" });
    }

    const query = `DELETE FROM choresTable WHERE id = $1 RETURNING *`;
    const result = await queryRunner.query(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: "Chore not found" });
    }

    res.status(200).json({
      success: true,
      message: "Chore deleted successfully",
      chore: result[0],
    });
  } catch (error: any) {
    console.error("Failed to delete chore:", error.message);
    res.status(500).json({ success: false, error: "Failed to delete chore" });
  }
});

choresRouter.get("/roommates/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const apartmentId = await getAppartmentId(userId);

    if (!apartmentId) {
      return res
        .status(400)
        .json({ success: false, error: "Apartment not found" });
    }

    const query = `
      SELECT u.id, u.fname, u.lname 
      FROM usersTable u 
      WHERE u.aptid = ${apartmentId}`;

    const result = await queryRunner.query(query);

    res.status(200).json({ success: true, roommates: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

choresRouter.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { isDone } = req.body;
    const query = `UPDATE choresTable SET isDone = ${isDone} WHERE id = ${id}`;
    await queryRunner.query(query);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default choresRouter;
