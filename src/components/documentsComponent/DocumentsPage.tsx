import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./DocumentsPage.css";
import AddDocumentsDialog from "./AddDocumentsDialog";
import {
    Button,
} from "@mui/material";

function DocumentsPage({ userId } : { userId: number }) {
    const [documents, setDocuments] = useState<{ id: number; name: string; category: string; description: string; }[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchDocuments = async () => {
        await axios.get(`/documents/${userId}`)
            .then((response) => {
                setDocuments(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch documents:", error.message);
            });
    };

    useEffect(() => {
        fetchDocuments();
    }, [userId]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = (isCreated: boolean) => {
        setDialogOpen(false);
        if (isCreated) {
            alert("Document created successfully.");
            fetchDocuments();  // Refresh the documents list
        }
    };

    return (
        <div className="container">
            <h1>Documents</h1>
            <div className="dataGrid" style={{ height: 400, width: '70%' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(document => (
                            <tr key={document.id}>
                                <td>{document.category}</td>
                                <td>{document.name}</td>
                                <td>{document.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="addButtonContainer">
                <Button
                    onClick={handleDialogOpen}
                    className="button"
                    variant="contained"
                    color="primary"
                    sx={{
                        backgroundColor: "#F8C794",
                        color: "black",
                        fontSize: "0.7rem",
                        padding: "0.7rem 1rem",
                        "&:hover": { backgroundColor: "#D8AE7E" },
                    }}
                >
                    Add Document
                </Button>
            </div>
            <AddDocumentsDialog
                aptId={102}
                open={dialogOpen}
                onClose={(isCreated: boolean) => {
                    handleDialogClose(isCreated);
                }}
            />
        </div>
    );
}

export default DocumentsPage;
