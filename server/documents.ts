import express from "express";
import queryRunner from "./database/databasepg";

const documentsRouter = express.Router();

documentsRouter.get("/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    const apartmentId = await getAppartmentId(userId);
    
    const query = `SELECT d.id, d.user_id, d.category, d.description, d.name, d.aptid FROM documentstable d WHERE d.aptid = ${apartmentId}`;
    const result = await queryRunner.query(query);
    console.log("result: ", result);
    res.status(200).json(result);
});

documentsRouter.post("/create", async (req, res) => {
    const { category, name, description, aptId } = req.body;
    
    if (!category || !name || !description || !aptId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const query = `INSERT INTO documentstable (category, name, description, aptid) VALUES ($1, $2, $3, $4)`;
        await queryRunner.query(query, [category, name, description, aptId]);
        res.status(201).json({ success: true, message: "Document created successfully" });
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

async function getAppartmentId(userId: number): Promise<number> {
    const query = `SELECT u.aptid FROM userstable u WHERE u.id = '${userId}'`;
    const result = await queryRunner.query(query);
    return result[0]?.aptid || 102;  // Return 102 if no apartment ID is found
}

export class Documents {
    private userId: number;
    private apartmentId: number;

    constructor(userId: number, apartmentId: number) {
        this.userId = userId;
        this.apartmentId = apartmentId;
    }
}

export default documentsRouter;
