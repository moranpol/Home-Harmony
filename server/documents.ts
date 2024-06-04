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
    const { category, name, description, userId } = req.body;
    
    if (!category || !name || !description || !userId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const aptId = await getAppartmentId(userId);

        const query = `INSERT INTO documentstable (category, name, description, aptid) VALUES ($1, $2, $3, $4)`;
        await queryRunner.query(query, [category, name, description, aptId]);
        res.status(201).json({ success: true, message: "Document created successfully" });
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

documentsRouter.delete("/:documentId", async (req, res) => {
    const documentId = Number(req.params.documentId);
    
    try {
        const query = `DELETE FROM documentstable WHERE id = $1`;
        await queryRunner.query(query, [documentId]);
        res.status(200).json({ success: true, message: "Document deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

async function getAppartmentId(userId: number): Promise<number> {
    const query = `SELECT u.aptid FROM userstable u WHERE u.id = '${userId}'`;
    const result = await queryRunner.query(query);
    console.log("aptId: ", result[0]?.aptid);
    return result[0]?.aptid;
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
