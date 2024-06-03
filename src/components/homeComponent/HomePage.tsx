import React, { useEffect, useState } from "react";
import BulletinPaper from "./bulletinComponent/BulletinPaper";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Bulletin from "./bulletinComponent/bulletin";
import "./HomePage.css";
import AddBulletinDialog from "./bulletinComponent/AddBulletinDialog";
import { IconButton } from "@mui/material";
import NavigateBar from "../navigateBarComponent/NavigateBar";

function HomePage({ userId }: { userId: number }) {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const getBulletins = () => {
    axios
      .get(`/bulletins/${userId}`)
      .then((res) => {
        const data = res.data;
        const bulletinsList: Bulletin[] = data.map((bulletin: any) => ({
          id: bulletin.id,
          userName: bulletin.userName,
          info: bulletin.info,
          date: new Date(bulletin.date),
        }));
        setBulletins(bulletinsList);
      })
      .catch((error) => {
        console.log("Failed to retrieve bulletins", error);
      });
  }

  useEffect(() => {
    getBulletins();
  }, [userId]);

  const handleDelete = (id: number) => {
    axios
      .delete(`/bulletins/${id}`)
      .then((res) => {
        if (res.data.success) {
          setBulletins((prevBulletins) =>
            prevBulletins.filter((bulletin) => bulletin.id !== id)
          );
        } else {
          console.log("Failed to delete bulletin");
        }
      })
      .catch((error) => {
        console.log("Failed to delete bulletin", error);
      });
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (isCreated: boolean) => {
    setDialogOpen(false);

    if (isCreated) {
      alert("Bulletin created successfully.");
      getBulletins();
    }
  };

  return (
    <div style={{ margin: "10px" }}>
      <NavigateBar userId={userId}/>
      {bulletins.map((bulletin) => (
        <BulletinPaper
          key={bulletin.id}
          id={bulletin.id}
          userName={bulletin.userName}
          info={bulletin.info}
          date={bulletin.date}
          onDelete={handleDelete}
        />
      ))}
      <IconButton
        onClick={handleDialogOpen}
        aria-label="add"
        size="large"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AddCircleOutlineIcon
          fontSize="large"
          style={{ color: isHovering ? "black" : "" }}
        />
      </IconButton>
      <AddBulletinDialog
        userId={userId}
        open={dialogOpen}
        onClose={(isCreated: boolean) => {
          handleDialogClose(isCreated);
        }}
      />
    </div>
  );
}

export default HomePage;
