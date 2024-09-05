import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import "./ExpensesPage.css";
import AddExpenseForm from "./AddExpenseForm";
import EditExpenseForm from "./EditExpenseForm";

export interface Expense {
  id: number;
  user_id: number;
  fname: string;
  date: string;
  product: string;
  cost: number;
}

function AddExpenseButton({
  userId,
  setShowAddForm,
}: {
  userId: number;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function onAddExpenseButtonClick() {
    console.log("Add Expense button clicked");
    setShowAddForm(true);
  }
  return (
    <button className="addButton" onClick={onAddExpenseButtonClick}>
      Add Expense
    </button>
  );
}

function ClearTableButton({
  isManager,
  update,
}: {
  isManager: boolean;
  update: () => void;
}) {
  function onClearTableButtonClick() {
    console.log("Clear Table button clicked");
    if (window.confirm("Are you sure you want to clear the table?")) {
      axios
        .delete(`/expenses/delete`)
        .then((response) => {
          console.log("Table cleared");
          update();
        })
        .catch((error) => {
          console.error("Failed to clear table:", error.message);
        });
    }
  }
  return isManager ? (
    <button className="clearButton" onClick={onClearTableButtonClick}>
      Clear Table
    </button>
  ) : null;
}

function CurrentBalanceText({ balance }: { balance: number }) {
  return <p className="balanceText">Current Balance: ${balance.toFixed(1)}</p>;
}

function ExpensesPage({
  userId,
  isManager,
}: {
  userId: number;
  isManager: boolean;
}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balance, setBalance] = useState(0);
  const [ShowAddForm, setShowAddForm] = useState(false);
  const [ShowEditForm, setShowEditForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const balanceResponse = await axios.get(`/expenses/balance/${userId}`);
      setBalance(balanceResponse.data);

      const expensesResponse = await axios.get(`/expenses/${userId}`);
      setExpenses(expensesResponse.data);
      console.log(expensesResponse.data);
    } catch (error: any) {
      console.error("Failed to fetch expenses:", error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshExpenses();
  }, [userId, refreshExpenses]);

  const handleExpenseAdded = () => {
    console.log("Expense added");
    refreshExpenses();
  };

  const handleExpenseDelete = async (rowId: number) => {
    console.log("Delete row with id:", rowId);
    if (window.confirm("Are you sure you want to delete this row?")) {
      try {
        await axios.delete(`/expenses/delete/${rowId}`);
        console.log("Row deleted");
        refreshExpenses();
      } catch (error: any) {
        console.error("Failed to delete row:", error.message);
      }
    }
  };

  const handleEdit = (row: Expense) => {
    console.log("Edit row:", row);
    setSelectedRow(row);
    setShowEditForm(true);
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
          <Dialog open={ShowAddForm} onClose={() => setShowAddForm(false)}>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogContent>
              <AddExpenseForm
                userId={userId}
                setShowAddForm={setShowAddForm}
                onExpenseAdded={handleExpenseAdded}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAddForm(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={ShowEditForm} onClose={() => setShowEditForm(false)}>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogContent>
              {selectedRow && (
                <EditExpenseForm
                  rowinfo={selectedRow}
                  userId={userId}
                  setShowForm={setShowEditForm}
                  onExpenseEdited={handleExpenseAdded}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowEditForm(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <div className="expensesGrid">
            <div className="headerContainer">
              <h1>EXPENSES</h1>
              <CurrentBalanceText balance={balance} />
            </div>
            <table className="expensesTable">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>DATE</th>
                  <th>PRODUCT</th>
                  <th>COST</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.fname}</td>
                    <td>{expense.date}</td>
                    <td>{expense.product}</td>
                    <td>${expense.cost}</td>
                    <td className="iconsTd">
                      {expense.user_id === userId ? (
                        <>
                          <IconButton
                            className="editIconButton"
                            onClick={() => handleEdit(expense)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            className="deleteIconButton"
                            onClick={() => handleExpenseDelete(expense.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          className="deleteIconButton"
                          onClick={() => handleExpenseDelete(expense.id)}
                          size="large"
                        ></IconButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="buttonContainer">
              <AddExpenseButton
                userId={userId}
                setShowAddForm={setShowAddForm}
              />
              <ClearTableButton
                isManager={isManager}
                update={handleExpenseAdded}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpensesPage;
