import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./DocumentsPage.css";
import AddDocumentsDialog from "./AddDocumentsDialog";
import {
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function DocumentsPage({ userId }: { userId: number }) {
  const [documents, setDocuments] = useState<
    {
      id: number;
      name: string;
      category: string;
      description: string;
      document: string;
    }[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/documents/${userId}`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch documents:", (error as any).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (isCreated: boolean) => {
    setDialogOpen(false);
    if (isCreated) {
      alert("Document created successfully.");
      fetchDocuments();
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const response = await axios.delete(`/documents/${documentId}`);
        if (response.data.success) {
          alert("Document deleted successfully.");
          fetchDocuments();
        } else {
          alert("Failed to delete document, please try again.");
        }
      } catch (error: any) {
        console.error("Failed to delete document:", error.message);
        alert("Failed to delete document, please try again.");
      }
    }
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
          <Typography variant="h6" className="loading-text">
            Loading...
          </Typography>
        </div>
      ) : (
        <>
          <div className="documentsGrid">
            <div className="headerContainer">
              <h1>DOCUMENTS</h1>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Document</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td>{document.name}</td>
                    <td>{document.category}</td>
                    <td>{document.description}</td>
                    <td className="document">
                      <a
                        href={`http://54.235.111.120:5000/documents/files/${document.document}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    </td>
                    <td className="iconTd">
                      <IconButton
                        className="deleteIconButton"
                        onClick={() => handleDeleteDocument(document.id)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="buttonContainer">
              <button className="addButton" onClick={handleDialogOpen}>
                Add Document
              </button>
            </div>
          </div>
          <AddDocumentsDialog
            open={dialogOpen}
            onClose={handleDialogClose}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}

export default DocumentsPage;
