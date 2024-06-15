import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import { DataGrid } from '@mui/x-data-grid';
import "./ExpensesPage.css";
import AddExpenseForm from "./AddExpenseForm";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';


function AddExpenseButton({userId, setShowForm} : {userId: number, setShowForm: React.Dispatch<React.SetStateAction<boolean>>}) {
    function onAddExpenseButtonClick() {
        console.log("Add Expense button clicked");
        setShowForm(true);
    }
    
    return <Button variant="outlined" component="span" className="addButton" onClick={onAddExpenseButtonClick}>Add Expense</Button>
}

function ClearTableButton({ isManager, update} : { isManager: boolean, update: () => void}) {
    function onClearTableButtonClick() {
        console.log("Clear Table button clicked");
        axios.delete(`/expenses/delete`) ///////////////
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
    const [expenses, setExpenses] = useState<{ id: number; name: string; date: string; product: string; cost: number; }[]>([]);
    const [balance, setBalance] = useState(0);
    const [showForm, setShowForm] = useState(false);

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

    useEffect(() => {
        fetchBalance();
        fetchAllExpenses();
    }, [userId]);

    const handleExpenseAdded = () => {
        console.log("Expense added");
        fetchBalance();
        fetchAllExpenses();
    };

    const columns = [
        { field: 'fname', headerName: 'NAME', width: 150 },
        { field: 'date', headerName: 'DATE', width: 150 },
        { field: 'product', headerName: 'PRODUCT', width: 300 },
        { field: 'cost', headerName: 'COST', width: 50},
    ];

    console.log("userId in ExpensesPage: ", userId);
    return (
        /*
        <div className="container">
            <h1>Expenses Page</h1>
            <CurrentBalanceText balance={balance}/>
            
            <div className="dataGrid" style={{ height: 400, width: '70%' }}>
                <DataGrid rows={expenses} columns={columns}   />
            </div>
            <div className="addButtonContainer">
                <AddExpenseButton userId={userId} setShowForm={setShowForm} />
            </div>
            {showForm && <AddExpenseForm userId={userId} />}
        </div>
        */
        <div>
        
            <Dialog open={showForm} onClose={() => setShowForm(false)}>
                <DialogTitle>Add Expense</DialogTitle>
                <DialogContent>
                    <AddExpenseForm userId={userId} setShowForm={setShowForm} onExpenseAdded={handleExpenseAdded}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowForm(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <div className="container">
            <h1>Expenses Page</h1>
            <CurrentBalanceText balance={balance}/>
            
            <div className="dataGrid" style={{ height: 400, width: '70%' }}>
                <DataGrid rows={expenses} columns={columns}   />
            </div>
            <div className="ButtonContainer">
                <AddExpenseButton userId={userId} setShowForm={setShowForm} />
                <ClearTableButton isManager={isManager} update={handleExpenseAdded}/>
            </div>
            {showForm && <AddExpenseForm userId={userId} setShowForm={setShowForm} onExpenseAdded={handleExpenseAdded}/>}
        </div>
        </div>
    );
}

export default ExpensesPage;
