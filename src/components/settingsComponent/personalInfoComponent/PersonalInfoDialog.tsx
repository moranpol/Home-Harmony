import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import "./PersonalInfoDialog.css";
import React, { useState } from "react";
import axios from "axios";

interface PersonalInfoDialogProps {
  userId: number;
  open: boolean;
  onClose: (isCreated: boolean) => void;
}

const PersonalInfoDialog: React.FC<PersonalInfoDialogProps> = ({
  userId,
  open,
  onClose,
}) => {
  const [personalInfo, setPersonalInfo] = useState<{
    firstName: string;
    lastName: string;
    image: File | undefined;
    [key: string]: string | File | undefined;
  }>({
    firstName: "",
    lastName: "",
    image: undefined,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    image: "",
  });

  const [selectedOption, setSelectedOption] = useState("firstName");
  const [successMessage, setSuccessMessage] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setPersonalInfo({ ...personalInfo, image: files[0] });
    } else {
      setPersonalInfo({ ...personalInfo, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (selectedOption === "firstName" && !personalInfo.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    } else {
      newErrors.firstName = "";
    }

    if (selectedOption === "lastName" && !personalInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    } else {
      newErrors.lastName = "";
    }

    if (selectedOption === "image" && !personalInfo.image) {
      newErrors.image = "Please upload an image.";
      isValid = false;
    } else {
      newErrors.image = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setSuccessMessage("");
    setPersonalInfo({
      firstName: "",
      lastName: "",
      image: undefined,
    });
    setErrors({
      firstName: "",
      lastName: "",
      image: "",
    });
  };

  const onSave = async () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("userId", userId.toString());
      formData.append("type", selectedOption);
      formData.append(
        "value",
        selectedOption === "image" ? "" : personalInfo[selectedOption] || ""
      );
      if (personalInfo.image) {
        formData.append("image", personalInfo.image as File);
      }

      axios
        .post("/settings/personalInfo/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setSuccessMessage("Personal info updated successfully.");
          } else {
            alert("Personal info update failed, please try again.");
          }
        })
        .catch((error) => {
          console.log("Personal info update failed", error);
          alert("Personal info update failed, please try again.");
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
        Update Personal Info
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
          maxWidth: "37.5rem",
          padding: "2rem",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        <FormControl>
          <FormLabel>
            What do you want to update?
          </FormLabel>
          <RadioGroup
            value={selectedOption}
            name="radioChecked"
            onChange={handleOptionChange}
          >
            <FormControlLabel
              value="firstName"
              control={<Radio />}
              label="First Name"
            />
            <FormControlLabel
              value="lastName"
              control={<Radio />}
              label="Last Name"
            />
            <FormControlLabel
              value="image"
              control={<Radio />}
              label="Profile Photo"
            />
          </RadioGroup>
        </FormControl>
        <Grid container spacing={2}>
          {selectedOption === "firstName" && (
            <Grid item xs={12}>
              <TextField
                style={{ marginBottom: "1rem", width: "100%" }}
                onChange={onChange}
                value={personalInfo.firstName}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                className="inputField"
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                multiline
                autoFocus
                id="firstName"
                label="First Name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}
          {selectedOption === "lastName" && (
            <Grid item xs={12}>
              <TextField
                style={{ marginBottom: "1rem", width: "100%" }}
                onChange={onChange}
                value={personalInfo.lastName}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                className="inputField"
                required
                fullWidth
                multiline
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}
          {selectedOption === "image" && (
            <Grid item xs={12}>
              <input
                name="image"
                type="file"
                accept="image/*"
                className="fileInput"
                style={{ display: "none" }}
                id="image"
                onChange={onChange}
              />
              <label htmlFor="image" className="fileInputLabel">
                <Button
                  variant="outlined"
                  component="span"
                  className="MuiButton-root"
                >
                  {personalInfo.image ? (
                    <>
                      <span>{personalInfo.image.name}</span>
                      <IconButton
                        onClick={() =>
                          setPersonalInfo({ ...personalInfo, image: undefined })
                        }
                        edge="end"
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  ) : (
                    "Upload Profile Picture"
                  )}
                </Button>
              </label>
              {errors.image && (
                <Typography
                  variant="caption"
                  color="error"
                  style={{ padding: "10px" }}
                >
                  {errors.image}
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
        {successMessage && (
          <Typography
            variant="body1"
            style={{
              color: "green",
              textAlign: "left",
              marginTop: "1rem",
            }}
          >
            {successMessage}
          </Typography>
        )}
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
          onClick={onSave}
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonalInfoDialog;
