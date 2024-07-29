import React, { useEffect, useState, useCallback } from "react";
import BulletinPaper from "./bulletinComponent/BulletinPaper";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Bulletin from "./bulletinComponent/bulletin";
import "./HomePage.css";
import AddBulletinDialog from "./bulletinComponent/AddBulletinDialog";
import { Grid, IconButton, Typography } from "@mui/material";
import MyChoresTable from "../choresComponent/MyChoresTable";

function HomePage({ userId }: { userId: number }) {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const getBulletins = useCallback(() => {
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
  }, [userId]);

  useEffect(() => {
    getBulletins();
  }, [getBulletins]);

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
      <div className="home-page">
      <Grid container spacing={4} >
        <Grid item xs={11} sm={9} md={4}>
          <Typography variant="h6" className="section-title">
            MY CHORES
          </Typography>
          <MyChoresTable userId={userId} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" className="section-title">
            BULLETIN BOARD
          </Typography>
          <Grid container spacing={2}>
            {bulletins.map((bulletin) => (
              <Grid item xs={6} sm={5} md={4} key={bulletin.id}>
                <BulletinPaper
                  id={bulletin.id}
                  userName={bulletin.userName}
                  info={bulletin.info}
                  date={bulletin.date}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4} className="center-content">
              <IconButton
                onClick={handleDialogOpen}
                aria-label="add"
                size="large"
                className="button-plus"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <AddCircleOutlineIcon
                  className="plus"
                  fontSize="large"
                  style={{ color: isHovering ? "black" : "" }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
