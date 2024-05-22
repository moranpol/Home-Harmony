import express from "express";
import DataSource from "./database/databasepg";

const documentsRouter = express.Router();

documentsRouter.get("/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    const apartmentId = await getAppartmentId(userId);
    //const query = `SELECT d.id, d.user_id, d.category, d.description, d.name FROM documentstable d INNER JOIN userstable u ON d.user_id=u.id WHERE d.aptid=${apartmentId}`;
    const query = `SELECT d.id, d.user_id, d.category, d.description, d.name FROM documentstable d WHERE d.aptid=${apartmentId}`;
    const result = await DataSource.createQueryRunner().manager.query(query);
    console.log("result: ", result);
    res.status(200).json(result);
});

// probably should be moved to user.ts or apartment.ts - todo
async function getAppartmentId(userId: number): Promise<number> {
    const query = `SELECT u.aptid FROM userstable u WHERE u.id = '${userId}'`;
    const result = await DataSource.createQueryRunner().manager.query(query);
    //return result[0]?.aptid;
    return 102;
}

export class Documents {
    private userId: number
    ;
    private apartmentId: number;

    constructor(userId: number, apartmentId: number) {
        this.userId = userId;
        this.apartmentId = apartmentId;
    }
}

export default documentsRouter;