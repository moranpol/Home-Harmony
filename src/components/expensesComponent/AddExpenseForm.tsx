import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid
} from '@mui/material';

interface AddExpenseFormProps {
  userId: number;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  onExpenseAdded: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ userId, setShowAddForm, onExpenseAdded }) => {
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

    if (!expenseInfo.date.trim()) {
      newErrors.date = "Date is required.";
      isValid = false;
    } else if (new Date(expenseInfo.date) > new Date()) {
        newErrors.date = "Date cannot be in the future.";
        isValid = false;
    }else {
      newErrors.date = "";
    }

    if (!expenseInfo.product.trim()) {
      newErrors.product = "Product is required.";
      isValid = false;
    } else {
      newErrors.product = "";
    }

    if (expenseInfo.cost <= 0) {
      newErrors.cost = "Cost must be greater than 0.";
      isValid = false;
    } else {
      newErrors.cost = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      axios.post("/expenses/add", {
        userId: expenseInfo.userId,
        date: expenseInfo.date,
        product: expenseInfo.product,
        cost: expenseInfo.cost
      })
      .then((response) => {
        console.log("Expense added successfully");
        onExpenseAdded();
        setShowAddForm(false);
      })
      .catch((error) => {
        console.error("Failed to add expense:", error.message);
      });
    }
  };

  return (
    <Dialog
      open
      onClose={() => setShowAddForm(false)}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle
        style={{ textAlign: "center", fontSize: "2rem", color: "#333333" }}
      >
        Add Expense
        <span
          style={{
            display: "block",
            height: "0.1875rem",
            backgroundColor: "#C3A6A0",
            width: "5rem",
            margin: "0.5rem auto",
            borderRadius: "0.125rem",
          }}
        />
      </DialogTitle>
      <DialogContent
        style={{
          padding: "1.3rem",
          boxSizing: "border-box",
          maxWidth: "30rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="date"
              label="Date"
              value={expenseInfo.date}
              error={Boolean(errors.date)}
              helperText={errors.date}
              InputProps={{
                sx: { "& .MuiInputBase-input": { border: "hidden" } },
              }}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                setExpenseInfo({ ...expenseInfo, date: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Product"
              value={expenseInfo.product}
              error={Boolean(errors.product)}
              helperText={errors.product}
              fullWidth
              multiline
              onChange={(e) =>
                setExpenseInfo({ ...expenseInfo, product: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              label="Cost"
              value={expenseInfo.cost}
              error={Boolean(errors.cost)}
              helperText={errors.cost}
              fullWidth
              multiline
              onChange={(e) => {
                const value = e.target.value;
                setExpenseInfo({
                  ...expenseInfo,
                  cost: value === "" ? 0 : parseFloat(value),
                });
              }}
              inputProps={{ step: "0.1", min: "0.1" }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowAddForm(false)}
          style={{ color: "#C3A6A0", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          style={{ color: "#C3A6A0", textTransform: "none" }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseForm;
