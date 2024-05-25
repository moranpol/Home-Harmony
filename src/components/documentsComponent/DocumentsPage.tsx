import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import { DataGrid } from '@mui/x-data-grid';
import "./DocumentsPage.css";

function onAddExpenseButtonClick() {
    console.log("Add Document button clicked");
}

function AddExpenseButton({userId} : {userId: number}) {
    return <Button variant="outlined" component="span" className="addButton" onClick={onAddExpenseButtonClick}>Add Document</Button>
}

function DocumentsPage({userId} : {userId: number}) {
    const [documents, setDocuments] = useState<{ id: number; name: string; category: string; description: string;/*add documnet*/  }[]>([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            await axios.get(`/documents/${userId}`)
            .then((response) => {
                setDocuments(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch documents:", error.message);
            });
        };

        fetchDocuments();
    }, [userId]);

    const columns = [
        { field: 'name', headerName: 'NAME', width: 150 },
        { field: 'category', headerName: 'CATEGORY', width: 150 },
        { field: 'description', headerName: 'DESCRIPTION', width: 150 },
        //{ field: 'document', headerName: 'DOCUMENT', width: 150},
    ];
    console.log("documents in DocumentsPage: ", documents);
    console.log("userId in DocumentsPage: ", userId);
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
                            {/* Add more columns as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(document => (
                            <tr key={document.id}>
                                <td>{document.category}</td>
                                <td>{document.name}</td>
                                <td>{document.description}</td>
                                {/* Add more cells as needed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="addButtonContainer">
                <AddExpenseButton userId={userId} />
            </div>
        </div>
    );
}

export default DocumentsPage;
