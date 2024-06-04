import express from "express";
import queryRunner from "./database/databasepg";
import { signOut } from "aws-amplify/auth";
import path from "path";
import fs from "fs";

const navigateBarRouter = express.Router();

const profileImageDir = path.join(__dirname, "document-home-harmony", "profile-image");

navigateBarRouter.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const query = `SELECT u.fname, apt.address FROM apartmentsTable apt JOIN userstable u ON apt.id = u.aptid WHERE u.id = ${userId};`;
    const result = await queryRunner.query(query);
    const navigateBarInfo = {
      address: result[0].address,
      userName: result[0].fname,
      profileImage:"" as string | null,
    };

    const profileImagePath = path.join(profileImageDir, `${userId}.png`);
    if (fs.existsSync(profileImagePath)) {
      navigateBarInfo.profileImage = `document-home-harmony/profile-images/${userId}.png`;
    }

    res.status(200).json(navigateBarInfo);
  } catch (err) {
    console.error("Failed to fetch navigate bar:", err);
    res.status(500).send("Failed to fetch navigate bar");
  }
});


navigateBarRouter.post("/logout", async (req, res) => {
  try {
    await signOut();
    res.status(200).send("Logged out");
  } catch (err) {
    console.error("Failed to logout:", err);
    res.status(500).send("Failed to logout");
  }
});

export default navigateBarRouter;
