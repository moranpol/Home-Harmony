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
      userId: row.userid
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

async function checkAndUpdateChore(chore: Chore) {
  if (chore.isDone && chore.isRepeat) {
    const currentDate = new Date();
    const startDate = new Date(chore.startDate);

    if (chore.repeat === 'monthly' && currentDate.getDate() === startDate.getDate()) {
      chore.isDone = false;
    } else if (chore.repeat === 'weekly' && currentDate.getDay() === startDate.getDay()) {
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