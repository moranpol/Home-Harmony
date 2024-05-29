import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import './AddExpenseForm.css';

function AddExpenseForm({ userId, setShowForm, onExpenseAdded  }: { userId: number, setShowForm: React.Dispatch<React.SetStateAction<boolean>>, onExpenseAdded: () => void}) {
    const [expenseInfo, setExpenseInfo] = useState({
        userId: userId,
        date: "",
        product: "",
        cost: 0
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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Form submitted");
        if (validateForm()) {
            /*
            const formData = new FormData();
            formData.append("date", expenseInfo.date);
            formData.append("product", expenseInfo.product);
            formData.append("cost", expenseInfo.cost.toString());
            */

            axios.post("/expenses/add", {
                userId: expenseInfo.userId,
                date: expenseInfo.date,
                product: expenseInfo.product,
                cost: expenseInfo.cost})
            
            .then((response) => {
                console.log("Expense added successfully");
                console.log("Response: ", response.data);
            })
            .catch((error) => {
                console.error("Failed to add expense:", error.message);
            });

            onExpenseAdded();
            setShowForm(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                <TextField type="number" value={expenseInfo.cost} error={Boolean(errors.cost)} onChange={e => setExpenseInfo({...expenseInfo, cost: Number(e.target.value)})} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );

}
export default AddExpenseForm;