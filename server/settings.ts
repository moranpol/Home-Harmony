import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import queryRunner from "./database/databasepg";
import { deleteUser, signIn, signOut } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import { enviorment } from "./enviorments/enviorment";

const settingsRouter = express.Router();

Amplify.configure({
  Auth: { Cognito: enviorment.Cognito },
});

const profileImageDir = path.join(
  __dirname,
  "..",
  "app_documents",
  "profile_image"
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImageDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

settingsRouter.post(
  "/personalInfo/update",
  upload.single("image"),
  async (req, res) => {
    const profileInfo = req.body;

    try {
      switch (profileInfo.type) {
        case "firstName":
          const firstNameQuery = `UPDATE usersTable SET fname = '${profileInfo.value}' WHERE id = '${profileInfo.userId}'`;
          await queryRunner.query(firstNameQuery);
          res.status(200).json({
            success: true,
            message: "First name updated successfully",
          });
          break;
        case "lastName":
          const lastNameQuery = `UPDATE usersTable SET lname = '${profileInfo.value}' WHERE id = '${profileInfo.userId}'`;
          await queryRunner.query(lastNameQuery);
          res.status(200).json({
            success: true,
            message: "Last name updated successfully",
          });
          break;
        case "image":
          console.log(req.file);
          if (req.file) {
            const profileImagePath = path.join(
              profileImageDir,
              `${profileInfo.userId}.png`
            );
            if (fs.existsSync(profileImagePath)) {
              fs.unlinkSync(profileImagePath);
            }
            fs.renameSync(req.file.path, profileImagePath);
            res.status(200).json({
              success: true,
              message: "Profile image updated successfully",
            });
          } else {
            res.status(400).json({
              success: false,
              message: "No image file provided",
            });
          }
          break;
        default:
          res.status(400).json({
            success: false,
            message: "Invalid update type",
          });
          break;
      }
    } catch (error: any) {
      console.log("Profile update failed", error);
      res.status(500).json({ success: false, error: "Profile update failed" });
    }
  }
);

settingsRouter.post("/apartment/exit", async (req, res) => {
  const { userId } = req.body;

  try {
    let query = `SELECT aptid FROM usersTable WHERE id = '${userId}'`;
    const result = await queryRunner.query(query);
    const aptId = result[0].aptid;
    query = `SELECT managerid FROM apartmentstable WHERE id = '${aptId}'`;
    const manager = await queryRunner.query(query);

    if (manager[0].managerid === userId) {
      res.status(400).json({
        success: false,
        error:
          "Manager cannot exit apartment, you need to replace a manager or delete apartment.",
      });
    } else {
      const exitQuery = `UPDATE usersTable SET aptid = '' WHERE id = '${userId}`;
      await queryRunner.query(exitQuery);
      res.status(200).json({ success: true, message: "User exited apartment" });
    }
  } catch (error) {
    console.log("Failed to exit apartment", error);
    res.status(500).json({ success: false, error: "Failed to exit apartment" });
  }
});

settingsRouter.delete("/account/delete", async (req, res) => {
  const { userId, password } = req.query;

  try {
    let query = `SELECT aptid, email FROM usersTable WHERE id = '${userId}'`;
    const result = await queryRunner.query(query);
    const aptId = result[0].aptid;
    query = `SELECT managerid FROM apartmentstable WHERE id = '${aptId}'`;
    const manager = await queryRunner.query(query);

    if (manager[0].managerid === Number(userId)) {
      res.status(400).json({
        success: false,
        error:
          "Managers cannot delete their account before replacing themselves or deleting the apartment.",
      });
    } else {
      await signOut();
      await signIn({
        username: result[0].email,
        password: password ? password.toString() : "",
      });
      await deleteUser();
      const deleteQuery = `DELETE FROM usersTable WHERE id = '${userId}'`;
      await queryRunner.query(deleteQuery);
      res.status(200).json({ success: true, message: "User deleted account" });
    }
  } catch (error: any) {
    if (error.name === "NotAuthorizedException") {
      res.status(401).json({ success: false, error: "Invalid password" });
    } else {
      console.log("Failed to delete account", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to delete account" });
    }
  }
});

settingsRouter.delete("/apartment/delete", async (req, res) => {
  const { userId } = req.query;

  try {
    let query = `SELECT aptid FROM usersTable WHERE id = '${userId}'`;
    const result = await queryRunner.query(query);
    const aptId = result[0].aptid;

    query = `UPDATE usersTable SET aptid = '' WHERE aptid = '${aptId}'`;
    await queryRunner.query(query);
    const deleteQuery = `DELETE FROM apartmentstable WHERE id = '${aptId}'`;
    await queryRunner.query(deleteQuery);
    res.status(200).json({ success: true, message: "Apartment deleted" });
  } catch (error) {
    console.log("Failed to delete apartment", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete apartment" });
  }
});

settingsRouter.get("/getUsers", async (req, res) => {
  const { userId } = req.query;

  try {
    let query = `SELECT aptid FROM usersTable WHERE id = '${userId}'`;
    let result = await queryRunner.query(query);
    const aptId = result[0].aptid;
    query = `SELECT id, fname, lname FROM usersTable WHERE aptid = '${aptId}'`;
    result = await queryRunner.query(query);
    const users = result.map((user: any) => {
      return {
        id: user.id,
        fname: user.fname,
        lname: user.lname,
      };
    });
    res.status(200).json(users);
  } catch (error) {
    console.log("Failed to get users", error);
    res.status(500).json({ error: "Failed to get users" });
  }
});

settingsRouter.post("/changeManager", async (req, res) => {
  const { userId, newManagerId } = req.body;

  try {
    let query = `SELECT aptid FROM usersTable WHERE id = '${userId}'`;
    const result = await queryRunner.query(query);
    const aptId = result[0].aptid;
    query = `UPDATE apartmentstable SET managerid = '${newManagerId}' WHERE id = '${aptId}'`;
    await queryRunner.query(query);
    res.status(200).json({ success: true, message: "Manager replaced" });
  } catch (error) {
    console.log("Failed to replace manager", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to replace manager" });
  }
});

export default settingsRouter;
