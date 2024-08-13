import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import './ExpenseForm.css';
import { Expense } from './ExpensesPage'; 

function EditExpenseForm({rowinfo, userId, setShowForm, onExpenseEdited}: { rowinfo: Expense, userId: number, setShowForm: React.Dispatch<React.SetStateAction<boolean>>, onExpenseEdited: () => void}) { 
    
    useEffect(() => {
        const [day, month, year] = rowinfo.date.split('/');
        const formattedDate = `20${year}-${month}-${day}`;
        console.log("formattedDate: ", formattedDate);
        setExpenseInfo(prevInfo => ({
            ...prevInfo,
            date: formattedDate
        }));
    }, [rowinfo]);

    console.log("EditExpenseForm rowinfo: ", rowinfo);

    const [expenseInfo, setExpenseInfo] = useState({
        rowinfo: rowinfo,
        userId: userId,
        date: rowinfo.date,
        product: rowinfo.product,
        cost: rowinfo.cost
    });

    
    
    const [errors, setErrors] = useState({
        date: "",
        product: "",
        cost: ""
    });

    const validateForm = () => {
        const newErrors = { ...errors };
        let isValid = true;

        if(!expenseInfo.date.trim()) {
            newErrors.date = "Date is required.";
            isValid = false;
        } else {
            newErrors.date = "";
        }

        if(!expenseInfo.product.trim()) {
            newErrors.product = "Product is required.";
            isValid = false;
        } else {
            newErrors.product = "";
        }

        if(expenseInfo.cost <= 0) {
            newErrors.cost = "Cost must be greater than 0.";
            isValid = false;
        } else {
            newErrors.cost = "";
        }
        
        setErrors(newErrors);
        return isValid;
    }

    const handleEdit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Form edited");
        if (validateForm()) {
            
            axios.post("/expenses/edit", { ////
                rowId: rowinfo.id,
                userId: userId,
                date: expenseInfo.date,
                product: expenseInfo.product,
                cost: expenseInfo.cost})
            
            .then((response) => {
                console.log("Expense edit successfully");
                console.log("Response: ", response.data);
                onExpenseEdited();
                setShowForm(false);
            })
            .catch((error) => {
                console.error("Failed to add expense:", error.message);
            });
        }
    };

    return (
        <form onSubmit={handleEdit}>
            <label>
                Date:
                <TextField type="date" value={expenseInfo.date} error={Boolean(errors.date)} onChange={e => setExpenseInfo({...expenseInfo, date: e.target.value})} />
            </label>
            <label>
                Product:
                <TextField type="text" value={expenseInfo.product} error={Boolean(errors.product)} onChange={e => setExpenseInfo({...expenseInfo, product: e.target.value})} />
            </label>
            <label>
                Cost:
                <TextField type="number" value={expenseInfo.cost} error={Boolean(errors.cost)} onChange={e => setExpenseInfo({...expenseInfo, cost: parseFloat(e.target.value)})} 
                inputProps={{ step:"0.1", min:"0.1"}}/>
            </label>
            <input type="submit" value="Submit" />
        </form>
    );

}

export default EditExpenseForm;