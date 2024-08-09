import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

interface AddDocumentDialogProps {
  userId: number;
  open: boolean;
  onClose: (isCreated: boolean) => void;
}

const AddDocumentsDialog: React.FC<AddDocumentDialogProps> = ({
  userId,
  open,
  onClose,
}) => {
  const [documentInfo, setDocumentInfo] = useState({
    category: "",
    name: "",
    description: "",
    file: undefined as File | undefined,
  });

  const [errors, setErrors] = useState({
    category: "",
    name: "",
    description: "",
    file: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "file" && files) {
      setDocumentInfo({ ...documentInfo, file: files[0] });
    } else {
      setDocumentInfo({ ...documentInfo, [name]: value });
    }
  };

  const validateForm = (): boolean => {
    let isValid: boolean = true;
    const errorsObj: { category: string; name: string; description: string; file: string } = {
      category: "",
      name: "",
      description: "",
      file: "",
    };
    if (!documentInfo.category) {
      errorsObj.category = "Category is required.";
      isValid = false;
    }
    if (!documentInfo.name) {
      errorsObj.name = "Name is required.";
      isValid = false;
    }
    if (!documentInfo.description) {
      errorsObj.description = "Description is required.";
      isValid = false;
    }
    if (!documentInfo.file) {
      errorsObj.file = "File is required.";
      isValid = false;
    }
    setErrors(errorsObj);
    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("category", documentInfo.category);
      formData.append("name", documentInfo.name);
      formData.append("description", documentInfo.description);
      formData.append("file", documentInfo.file as File);
      formData.append("userId", userId.toString());
      axios
        .post("/documents/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.success) {
            console.log("Document created");
            onClose(true);
          } else {
            alert("Document creation failed, please try again.");
          }
        })
        .catch((error: any) => {
          console.log("Document creation failed", error);
          alert("Document creation failed, please try again.");
        });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <DialogTitle
        style={{
          textAlign: "center",
          color: "#333333",
          fontSize: "2rem",
          letterSpacing: "0.125rem",
          textShadow: "0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        Create Document
        <span
          style={{
            content: "",
            position: "absolute",
            bottom: "-0.1rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "5rem",
            height: "0.1875rem",
            backgroundColor: "#C3A6A0",
            borderRadius: "0.125rem",
          }}
        />
      </DialogTitle>
      <DialogContent
        style={{
          width: "100%",
          maxWidth: "30rem",
          padding: "1.3rem",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              onChange={onChange}
              value={documentInfo.category}
              error={Boolean(errors.category)}
              helperText={errors.category}
              style={{ marginBottom: "1rem", width: "100%" }}
              autoComplete="category"
              name="category"
              required
              fullWidth
              multiline
              id="category"
              label="Category"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={onChange}
              value={documentInfo.name}
              error={Boolean(errors.name)}
              helperText={errors.name}
              style={{ marginBottom: "1rem", width: "100%" }}
              autoComplete="name"
              name="name"
              required
              fullWidth
              multiline
              id="name"
              label="Name"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={onChange}
              value={documentInfo.description}
              error={Boolean(errors.description)}
              helperText={errors.description}
              style={{ marginBottom: "1rem", width: "100%" }}
              autoComplete="description"
              name="description"
              required
              fullWidth
              multiline
              id="description"
              label="Description"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              name="file"
              type="file"
              accept="*"
              className="fileInput"
              onChange={onChange}
              style={{ display: "none", marginBottom: "0.5rem" }}
              id="file"
            />
            <label htmlFor="file" className="fileInputLabel">
              <Button
                variant="outlined"
                component="span"
                className="MuiButton-root"
              >
                {documentInfo.file ? (
                  <>
                    <span>{documentInfo.file.name}</span>
                    <IconButton
                      onClick={() =>
                        setDocumentInfo({ ...documentInfo, file: undefined })
                      }
                      edge="end"
                    >
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  "Upload File"
                )}
              </Button>
            </label>
            {errors && (
              <Typography
                variant="caption"
                color="error"
                style={{ padding: "10px" }}
              >
                {errors.file}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          style={{
            textTransform: "none",
            border: "none",
            borderRadius: "0.3125rem",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
            color: "#C3A6A0",
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          style={{
            textTransform: "none",
            border: "none",
            borderRadius: "0.3125rem",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
            color: "#C3A6A0",
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDocumentsDialog;
