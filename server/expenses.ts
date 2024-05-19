import express from "express";
import DataSource from "./database/databasepg";

const expensesRouter = express.Router();

expensesRouter.get("/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    const apartmentId = await getAppartmentId(userId);
    const query = `SELECT e.id, e.user_id, e.product, e.cost, to_char(e.date, 'dd/MM/yy') as date, u.fname FROM expenses e INNER JOIN userstable u ON e.user_id=u.id WHERE e.apt_id='${apartmentId}'`;
    const result = await DataSource.createQueryRunner().manager.query(query);
    res.status(200).json(result);
});

// probably should be moved to user.ts or apartment.ts - todo
async function getAppartmentId(userId: number): Promise<number> {
    const query = `SELECT u.aptid FROM userstable u WHERE u.id = '${userId}'`;
    const result = await DataSource.createQueryRunner().manager.query(query);
    return result[0]?.aptid;
}

export class Expenses {
    private userId: number;
    private apartmentId: number;

    constructor(userId: number, apartmentId: number) {
        this.userId = userId;
        this.apartmentId = apartmentId;
    }
}

export default expensesRouter;