import express from "express";
import queryRunner from "./database/databasepg";
import exp from "constants";
import e from "express";

const expensesRouter = express.Router();

expensesRouter.get("/:userId", async (req, res) => {
    console.log("expensesRouter.get, userId: ", req.params.userId);
    try{
    const userId = Number(req.params.userId);
    const apartmentId = await getAppartmentId(userId);
    console.log("in get: apartmentId: ", apartmentId);
    const query = `SELECT e.id, e.user_id, e.product, e.cost, to_char(e.date, 'dd/MM/yy') as date, u.fname FROM expenses e INNER JOIN userstable u ON e.user_id=u.id WHERE e.apt_id='${apartmentId}'`;
    const result = await queryRunner.query(query);
    console.log("expenses result: ", result);
    res.status(200).json(result);
    }
    catch(err){
        console.error("Failed to fetch expenses:", err);
        res.status(500).send("Failed to fetch expenses");
    }
});

expensesRouter.get("/balance/:userId", async (req, res) => {
    console.log("expensesRouter.get balance, userId: ", req.params.userId);
    try {
        const userId = Number(req.params.userId);
        const apartmentId = await getAppartmentId(userId);
        const sumAllCost = await queryRunner.query(`SELECT SUM(e.cost) FROM expenses e WHERE e.apt_id='${apartmentId}'`);
        const numRommates = await queryRunner.query(`SELECT COUNT(*) FROM userstable u WHERE u.aptid='${apartmentId}'`);
        const sumUserCost = await queryRunner.query(`SELECT SUM(e.cost) FROM expenses e WHERE e.apt_id='${apartmentId}' AND e.user_id='${userId}'`);
        const result = sumUserCost[0]?.sum - sumAllCost[0]?.sum / numRommates[0]?.count;

        console.log("balance result: ", result);
        res.status(200).json(result);
    } catch(err) {
        console.error("Failed to fetch balance:", err);
        res.status(500).send("Failed to fetch balance");
    }
});

expensesRouter.post("/add", async (req, res) => {
    try {
        console.log("trytry add expenseId: ", req.body.userId)
        const userId = Number(req.body.userId);
        console.log("userId: ", userId);

        await queryRunner.query('SELECT 1');
        console.log('Database connection is working');

        const apartmentId = await getAppartmentId(userId);
        console.log("apt id ", apartmentId);
        const expenseId = await getLastExpenseId() + 1;
        console.log("expenseId: ", expenseId)
        
        
        
        const query = `INSERT INTO expenses (id, user_id, apt_id, product, cost, date) VALUES ('${expenseId}', '${userId}', '${apartmentId}', '${req.body.product}', '${req.body.cost}', '${req.body.date}')`;
        await queryRunner.query(query);
        console.log("Expense added successfullyy");
        res.status(200).send("Expense added successfully");
        console.log("Expense added successfully");
    } catch(err) {
        console.error("Failed to add expense:", err);
        res.status(500).send("Failed to add expense");
    }
});

expensesRouter.delete("/delete", async (req, res) => {
    try{
        await queryRunner.query('DELETE FROM expenses');
        console.log("Table cleared");
        res.status(200).send("Table cleared");
        }
        catch(err){
            console.error("Failed to delete expenses:", err);
            res.status(500).send("Failed to delete expenses");
        }
});

// probably should be moved to user.ts or apartment.ts - todo
async function getAppartmentId(userId: number): Promise<number> {
    console.log("getAppartmentId userId: ", userId);
   try{
    const query = `SELECT u.aptid FROM userstable u WHERE u.id=${userId}`;
    const result = await queryRunner.query(query);
    console.log("getAppartmentId result: ", result);
    return result[0]?.aptid;
   }
    catch(err){
         console.error("Failed to fetch apartment:", err);
         return -1;
    }
}

async function getLastExpenseId(): Promise<number> {
    console.log("getLastExpenseId");
    const query = `SELECT MAX(id) FROM expenses`;
    const result = await queryRunner.query(query);
    console.log("getLastExpenseId result: ", result);
    return result[0]?.max;
}   
/*
export class Expenses {
    private userId: number;
    private apartmentId: number;

    constructor(userId: number, apartmentId: number) {
        this.userId = userId;
        this.apartmentId = apartmentId;
    }
}
*/
export default expensesRouter;