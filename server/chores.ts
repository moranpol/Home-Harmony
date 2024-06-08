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
      isDone: row.isDone,
      isRepeat: row.isRepeat,
      repeat: row.repeat,
      startDate: new Date(row.startDate),
      id: row.id,
      fname: row.fname,
      lname: row.lname,
      description: row.description,
      userId: row.userId
    }));

    for (const chore of chores) {
      await checkAndUpdateChore(chore);
    }
    res.status(200).json({ success: true, chores });
  } catch (error) {
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
