import { Paper, Typography, IconButton, Tooltip, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./BulletinPaper.css";

interface BulletinPaperProps {
  id: number;
  userName: string;
  info: string;
  date: Date;
  onDelete: (id: number) => void;
}

function BulletinPaper({
  id,
  userName,
  info,
  date,
  onDelete,
}: BulletinPaperProps): React.ReactElement {
  const [isHovering, setIsHovering] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#AD9999");

  useEffect(() => {
    const colorNumber = (Math.floor(Math.random() * 4) + 1).toString();

    switch (colorNumber) {
      case "1":
        setBackgroundColor("#AD9999");
        break;
      case "2":
        setBackgroundColor("#D1C8C1");
        break;
      case "3":
        setBackgroundColor("#8F8277");
        break;
      case "4":
        setBackgroundColor("#ABA098");
        break;
      default:
        setBackgroundColor("#AD9999");
    }
  }, []);

  return (
    <Paper elevation={3} className="bulletin-paper" style={{ backgroundColor }}>
      <Typography variant="body2" className="bulletin-date">
        {date.toDateString()}
      </Typography>
      <Typography
        variant="body1"
        className="bulletin-info"
        style={{ fontWeight: "bold" }}
      >
        {info}
      </Typography>
      <Box className="bulletin-footer">
        <Typography variant="body1">{userName}</Typography>
        <Tooltip
          title="Delete"
          arrow
          open={isHovering}
          onOpen={() => setIsHovering(true)}
          onClose={() => setIsHovering(false)}
        >
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => onDelete(id)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isHovering ? (
              <DeleteIcon fontSize="small" />
            ) : (
              <DeleteOutlineIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}

export default BulletinPaper;
