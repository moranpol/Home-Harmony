import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import { DataGrid } from '@mui/x-data-grid';
import "./ExpensesPage.css";

function onAddExpenseButtonClick() {
    console.log("Add Expense button clicked");
}

function AddExpenseButton({userId} : {userId: number}) {
    return <Button variant="outlined" component="span" className="addButton" onClick={onAddExpenseButtonClick}>Add Expense</Button>
}


function CurrentBalanceText({userId} : {userId: number}) {
    return <p className="balanceText">Current Balance: $1000</p>;
}


function ExpensesPage({userId} : {userId: number}) {
    const [expenses, setExpenses] = useState<{ id: number; name: string; date: string; product: string; cost: number; }[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            await axios.get(`/expenses/${userId}`)
            .then((response) => {
                setExpenses(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch expenses:", error.message);
            });
        };

        fetchExpenses();
    }, [userId]);

    const columns = [
        { field: 'fname', headerName: 'NAME', width: 150 },
        { field: 'date', headerName: 'DATE', width: 150 },
        { field: 'product', headerName: 'PRODUCT', width: 300 },
        { field: 'cost', headerName: 'COST', width: 50},
    ];

    console.log("userId in ExpensesPage: ", userId);
    return (
        <div className="container">
            <h1>Expenses Page</h1>
            <CurrentBalanceText userId={userId}/>
            
            <div className="dataGrid" style={{ height: 400, width: '70%' }}>
                <DataGrid rows={expenses} columns={columns}   />
            </div>
            <div className="addButtonContainer">
                <AddExpenseButton userId={userId} />
            </div>
        </div>
    );
}

export default ExpensesPage;
