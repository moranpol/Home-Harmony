import express from "express";
import queryRunner from "./database/databasepg";
import path from "path";
import fs from "fs";
import multer from "multer";

const documentsRouter = express.Router();
const documentDir = path.join(__dirname, "..", "app_documents", "document_files");

documentsRouter.use('/files', express.static(documentDir));

interface Document {
    id: number;
    user_id: number;
    category: string;
    description: string;
    name: string;
    aptid: number;
    document: string;
}

documentsRouter.get("/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    const apartmentId = await getAppartmentId(userId);
    
    const query = `SELECT d.id, d.user_id, d.category, d.description, d.name, d.aptid, d.document FROM documentstable d WHERE d.aptid = ${apartmentId}`;
    const result: Document[] = await queryRunner.query(query);

    const modifiedResult = result.map((doc: Document) => ({
        ...doc,
        document: path.basename(doc.document) 
    }));

    res.status(200).json(modifiedResult);
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

documentsRouter.post("/create", upload.single("file"), async (req, res) => {
    const { category, name, description, userId } = req.body;
    console.log("req.body: ", req.body);
    if (!category || !name || !description || !userId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const aptId = await getAppartmentId(userId);

        const uploadedFile = req.file; 

        if (!uploadedFile) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const query = `INSERT INTO documentstable (category, name, description, aptid, document, user_id) VALUES ($1, $2, $3, $4, $5, $6)`;
        await queryRunner.query(query, [category, name, description, aptId, uploadedFile.path, userId]);

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

export default documentsRouter;
