import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import { DataGrid } from '@mui/x-data-grid';
import "./ExpensesPage.css";
import AddExpenseForm from "./AddExpenseForm";
import EditExpenseForm from "./EditExpenseForm";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export interface Expense { 
    id: number;
    name: string; 
    date: string;
    product: string;
    cost: number;
}

function AddExpenseButton({userId, setShowAddForm} : {userId: number, setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>}) {
    function onAddExpenseButtonClick() {
        console.log("Add Expense button clicked");
        setShowAddForm(true);
    }
    return <Button variant="outlined" component="span" className="addButton" onClick={onAddExpenseButtonClick}>Add Expense</Button>
}

function ClearTableButton({ isManager, update} : { isManager: boolean, update: () => void}) {
    function onClearTableButtonClick() {
        console.log("Clear Table button clicked");
        axios.delete(`/expenses/delete`)
        .then((response) => {
            console.log("Table cleared");
            update();
        })
        .catch((error) => {
            console.error("Failed to clear table:", error.message);
        });
    }
    return isManager ? <Button variant="outlined" component="span" className="clearButton" onClick={onClearTableButtonClick}>Clear Table</Button> : null;   
}

function CurrentBalanceText({ balance }: { balance: number }) {
    return <p className="balanceText">Current Balance: ${balance.toFixed(1)}</p>;
}


function ExpensesPage({userId, isManager} : {userId: number, isManager: boolean}) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [balance, setBalance] = useState(0);
    const [ShowAddForm, setShowAddForm] = useState(false);
    const [ShowEditForm, setShowEditForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Expense | null>(null);

    const fetchAllExpenses = async () => {
        await axios.get(`/expenses/${userId}`)
        .then((response) => {
            setExpenses(response.data);
        })
        .catch((error) => {
            console.error("Failed to fetch expenses:", error.message);
        });
    };

    const fetchBalance = async () => {
        await axios.get(`/expenses/balance/${userId}`)
        .then((response) => {
            setBalance(response.data);
        })
        .catch((error) => {
            console.error("Failed to fetch expenses:", error.message);
        });
    };

    const refreshExpenses = () => {
        fetchBalance();
        fetchAllExpenses();
    };

    useEffect(() => {
        refreshExpenses();
    }, [userId]);

    const handleExpenseAdded = () => {
        console.log("Expense added");
        refreshExpenses();
    };

    const handleExpenseDelete = async (rowId: number) => {
        console.log("Delete row with id:", rowId);
        await axios.delete(`/expenses/delete/${rowId}`)
        .then((response) => {
            console.log("Row deleted");
            refreshExpenses();
        })
        .catch ((error) => {
            console.error("Failed to delete row:", error.message);
        });
    }

    const handleEdit = (row: Expense) => {
        console.log("Edit row:", row);
        setSelectedRow(row);
        setShowEditForm(true);         
    };

    const handleExpenseEdited = () => {
        console.log("Expense edited");
        refreshExpenses();
    };

    const columns = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params: any) => {
                console.log("params.row: ", params.row);
                const canEditDelete = params.row.user_id === userId; 
                return canEditDelete ? (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleExpenseDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </div>
            ) : null;
            }
        },
        { field: 'fname', headerName: 'NAME', width: 150, headerClassName: 'customHeader'},
        { field: 'date', headerName: 'DATE', width: 150, headerClassName: 'customHeader' },
        { field: 'product', headerName: 'PRODUCT', width: 250, headerClassName: 'customHeader' },
        { field: 'cost', headerName: 'COST', width: 50, headerClassName: 'customHeader'},
        
    ];

    console.log("userId in ExpensesPage: ", userId);
    return (
        <div>
            <Dialog open={ShowAddForm} onClose={() => setShowAddForm(false)}>
                <DialogTitle>Add Expense</DialogTitle>
                <DialogContent>
                    <AddExpenseForm userId={userId} setShowAddForm={setShowAddForm} onExpenseAdded={handleExpenseAdded}/>
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



            <div className="container">
            <h1>Expenses Page</h1>
            <CurrentBalanceText balance={balance}/>
            
            <div className="dataGrid" style={{ height: 400, width: '70%' }}>
                <DataGrid rows={expenses} columns={columns} classes={{
                        columnHeaders: 'customHeader' }} />
            </div>
            <div className="ButtonContainer">
                <AddExpenseButton userId={userId} setShowAddForm={setShowAddForm} />
                <ClearTableButton isManager={isManager} update={handleExpenseAdded}/>
            </div>
            {ShowAddForm && <AddExpenseForm userId={userId} setShowAddForm={setShowAddForm} onExpenseAdded={handleExpenseAdded}/>}
        </div>
        </div>
       
    );
}

export default ExpensesPage;
