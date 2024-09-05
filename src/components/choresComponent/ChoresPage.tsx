import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./ChoresPage.css";
import AddChoreDialog from "./AddChoreDialog";
import {
  IconButton,
  CircularProgress,
  Typography,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ChoresPage({
  userId,
  isManager,
}: {
  userId: number;
  isManager: boolean;
}) {
  const [chores, setChores] = useState<
    {
      id: number;
      description: string;
      fname: string;
      lname: string;
      isDone: boolean;
      isRepeat: boolean;
    }[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchChores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/chores/${userId}`);
      setChores(response.data.chores);
    } catch (error) {
      console.error("Failed to fetch chores:", (error as any).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchChores();
  }, [fetchChores]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (isCreated: boolean) => {
    setDialogOpen(false);
    if (isCreated) {
      fetchChores();
    }
  };

  const handleDeleteChore = async (choreId: number) => {
    if (window.confirm("Are you sure you want to delete this chore?")) {
      try {
        const response = await axios.delete(`/chores/${choreId}`);
        if (response.data.success) {
          alert("Chore deleted successfully.");
          fetchChores();
        } else {
          alert("Failed to delete chore, please try again.");
        }
      } catch (error: any) {
        console.error("Failed to delete chore:", error.message);
        alert("Failed to delete chore, please try again.");
      }
    }
  };

  const handleToggleChoreStatus = async (choreId: number, isDone: boolean) => {
    try {
      const response = await axios.put(`/chores/${choreId}`, {
        isDone: !isDone,
      });
      if (response.data.success) {
        fetchChores();
      } else {
        alert("Failed to update chore status.");
      }
    } catch (error: any) {
      console.error("Failed to update chore status:", error.message);
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
          <div className="choresGrid">
            <div className="headerContainer">
              <h1>CHORES</h1>
            </div>
            <table className="chorsTable">
              <thead>
                <tr>
                  <th>Chore</th>
                  <th>Assigned To</th>
                  <th className="actionsTh">Is Done</th>
                </tr>
              </thead>
              <tbody>
                {chores.map((chore) => (
                  <tr key={chore.id}>
                    <td>{chore.description}</td>
                    <td>{`${chore.fname} ${chore.lname}`}</td>
                    <td className="actionsTd">
                      <Checkbox
                        checked={chore.isDone}
                        onChange={() =>
                          handleToggleChoreStatus(chore.id, chore.isDone)
                        }
                        color="primary"
                      />
                      {isManager && (
                        <IconButton
                          className="deleteIconButton"
                          onClick={() => handleDeleteChore(chore.id)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isManager && (
              <div className="buttonContainer">
                <button className="addButton" onClick={handleDialogOpen}>
                  Add Chore
                </button>
              </div>
            )}
          </div>
          <AddChoreDialog
            open={dialogOpen}
            onClose={handleDialogClose}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}

export default ChoresPage;
