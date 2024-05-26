import express from "express";
import DataSource from "./database/databasepg";

const apartmentsRouter = express.Router();

function updateUserApartment(userId: number, apartmentId: number) {
  const query = `UPDATE usersTable SET aptid = ${apartmentId} WHERE id = ${userId}`;
  DataSource.createQueryRunner().manager.query(query);
}

apartmentsRouter.put("/search", async (req, res) => {
  const apartmentInfo = req.body;

  try {
    const query = `SELECT * FROM apartmentsTable WHERE id = ${apartmentInfo.apartmentId}`;
    const result = await DataSource.createQueryRunner().manager.query(query);

    if (result.length !== 0) {
      updateUserApartment(apartmentInfo.userId, apartmentInfo.apartmentId);
      res.status(200).json({ success: true, message: "Apartment found" });
    } else {
      res.status(404).json({ success: false, error: "Apartment not found" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apartmentsRouter.post("/create", async (req, res) => {
  const apartmentInfo = req.body;

  try {
    const query = `INSERT INTO apartmentsTable (address, name, managerId) VALUES ('${apartmentInfo.address}', '${apartmentInfo.name}', '${apartmentInfo.userId}') RETURNING id`;
    const result = await DataSource.createQueryRunner().manager.query(query);
    const apartmentId = result[0].id;
    updateUserApartment(apartmentInfo.userId, apartmentId);
    res.status(200).json({
      success: true,
      message: "Apartment created",
      apartmentId: apartmentId,
    });
  } catch (error: any) {
    console.log("Error creating apartment", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default apartmentsRouter;
