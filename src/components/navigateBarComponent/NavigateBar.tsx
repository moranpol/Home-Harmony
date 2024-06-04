import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import "./NavigateBar.css";
import axios from "axios";

const pages = ["HOME", "CALENDAR", "EXPENSES", "CHORES", "DOCUMENTS", "SETTINGS"];

function NavigateBar({ userId, setUserId }: { userId: number; setUserId: React.Dispatch<React.SetStateAction<number>> }) {
  const [navigateBarInfo, setNavigateBarInfo] = React.useState<any>({
    address: "",
    userName: "",
    profileImage: null,
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    axios
      .post("/navigate-bar/logout")
      .then((res) => {
        console.log("Logged out");
        setUserId(-1);
        localStorage.removeItem("userId");
        handleMenuClose();
        navigate("/login");
      })
      .catch((error) => {
        console.log("Failed to logout", error);
      });
  };

  React.useEffect(() => {
    axios
      .get(`/navigate-bar/${userId}`)
      .then((res) => {
        const data = res.data;
        setNavigateBarInfo({
          address: data.address,
          userName: data.userName,
          profileImage: data.profileImage,
        });
        console.log("Retrieved navigate bar info", data);
      })
      .catch((error) => {
        console.log("Failed to retrieve navigate bar info", error);
      });
  }, [userId]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.textContent) {
      case "HOME":
        navigate("/home");
        break;
      case "CALENDAR":
        console.log("Calendar");
        break;
      case "EXPENSES":
        navigate("/expenses");
        break;
      case "CHORES":
        console.log("Chores");
        break;
      case "DOCUMENTS":
        navigate("/documents");
        break;
      case "SETTINGS":
        console.log("Settings");
        break;
      default:
        navigate("/home");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#F6F6F6",
        color: "#000",
        boxShadow: "none",
      }}
      className="appBar"
    >
      <Toolbar
        disableGutters
        sx={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "none",
        }}
        className="toolbar"
      >
        <Box className="userInfo">
          <Typography
            className="helloText"
            sx={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 500,
              display: { xs: "none", md: "block" },
              textTransform: "uppercase",
              fontSize: "0.9rem",
            }}
          >
            Hello {navigateBarInfo.userName}
          </Typography>
          <IconButton sx={{ p: 0 }} onMouseEnter={handleMenuOpen}>
            {navigateBarInfo.profileImage ? (
              <Avatar src={navigateBarInfo.profileImage} />
            ) : (
              <AccountCircleIcon
                sx={{ color: "#000", fontSize: "2rem", cursor: "pointer" }}
              />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              onMouseLeave: handleMenuClose,
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
        <Box className="menuButtonsContainer" sx={{ flexGrow: 1 }}>
          <Box className="menuButtonsLeft" sx={{ flexGrow: 1 }}>
            {pages.slice(0, 3).map((page) => (
              <Button
                key={page}
                onClick={handleClick}
                className="menuButton"
                sx={{
                  color: "#31241E",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 400,
                  padding: { xs: "0.5rem 1rem", md: "0 1.5rem", lg: "0 2rem" },
                  textTransform: "uppercase",
                  fontSize: "1.2rem",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Typography
            className="logoText"
            sx={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "black",
              textTransform: "uppercase",
              flexShrink: 1,
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              lineHeight: "1.2",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "@media (max-width: 600px)": {
                fontSize: "1.2rem",
              },
              "@media (max-width: 400px)": {
                fontSize: "1rem",
              },
            }}
          >
            {navigateBarInfo.address}
          </Typography>
          <Box className="menuButtonsRight" sx={{ flexGrow: 1 }}>
            {pages.slice(3, 6).map((page) => (
              <Button
                key={page}
                onClick={handleClick}
                className="menuButton"
                sx={{
                  color: "#31241E",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 400,
                  padding: { xs: "0.5rem 1rem", md: "0 2rem" },
                  textTransform: "uppercase",
                  fontSize: "1.2rem",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Box>
        <Typography
          className="homeHarmonyText"
          noWrap
          sx={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "4rem",
            color: "black",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.2rem",
          }}
        >
          Home Harmony
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default NavigateBar;
