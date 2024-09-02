import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import "./NavigateBar.css";
import axios from "axios";

const pages = [
  "HOME",
  "CALENDAR",
  "EXPENSES",
  "CHORES",
  "DOCUMENTS",
  "SETTINGS",
];

function NavigateBar({
  userId,
  setUserId,
  isManager,
  setIsManager,
}: {
  userId: number;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
  isManager: boolean;
  setIsManager: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
        setIsManager(false);
        localStorage.removeItem("userId");
        localStorage.removeItem("isManager");
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
          address: data.aptName === '' ? data.address : data.aptName,
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
        navigate("/calendar");
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
        navigate("/settings");
        break;
      default:
        navigate("/home");
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar
      position="static"
      className="appBar"
      sx={{
        backgroundColor: "#F6F6F6",
        color: "#000",
        boxShadow: "none",
      }}
    >
      <Toolbar
        disableGutters
        className="toolbar"
        sx={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "none",
        }}
      >
        <Box
          className="userInfo"
          sx={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
            textTransform: "uppercase",
            fontSize: "0.9rem",
          }}
        >
          <Typography
            className="helloText"
            sx={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 500,
              display: "block",
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
        <Box className="menuButtonsContainer">
          <IconButton
            className="hamburger-menu"
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
          <Box className={`menuButtonsLeft ${mobileMenuOpen ? "active" : ""}`}>
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
              whiteSpace: "wrap",
              lineHeight: "1.2",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {navigateBarInfo.address}
          </Typography>
          <Box className={`menuButtonsRight ${mobileMenuOpen ? "active" : ""}`}>
            {pages.slice(3, 6).map((page) => (
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
        </Box>
        <Typography
          className="homeHarmonyText"
          sx={{
            fontFamily: "Roboto, sans-serif",
            color: "black",
            fontSize: { xs: "2rem", sm: "4rem" },
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
