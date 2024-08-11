import express from "express";
import queryRunner from "./database/databasepg";
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Home.harmony.supp@gmail.com',
    pass: 'owcx fxeh mhgm iqmo',
  },
});

const apartmentsRouter = express.Router();

function updateUserApartment(userId: number, apartmentId: number) {
  const query = `UPDATE usersTable SET aptid = ${apartmentId} WHERE id = ${userId}`;
  queryRunner.query(query);
}

apartmentsRouter.put("/search", async (req, res) => {
  const apartmentInfo = req.body;

  try {
    const query = `SELECT * FROM apartmentsTable WHERE id = ${apartmentInfo.apartmentId}`;
    const result = await queryRunner.query(query);

    if (result.length !== 0) {
      updateUserApartment(apartmentInfo.userId, apartmentInfo.apartmentId);
      res.status(200).json({ success: true, message: "Apartment found" });
    } else {
      res.status(404).json({ success: false, error: "Apartment not found" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apartmentsRouter.post("/create", async (req, res) => {
  const apartmentInfo = req.body;

  try {
    let query = `INSERT INTO apartmentsTable (address, name, managerId) VALUES ('${apartmentInfo.address}', '${apartmentInfo.name}', '${apartmentInfo.userId}') RETURNING id`;
    let result = await queryRunner.query(query);
    const apartmentId = result[0].id;
    updateUserApartment(apartmentInfo.userId, apartmentId);

    query = 'SELECT email FROM usersTable WHERE id = ' + apartmentInfo.userId;
    result = await queryRunner.query(query);
    const email = result[0].email;

    let mailOptions = {
      from: 'Home.harmony.supp@gmail.com',
      to: email,
      subject: 'Your Apartment Has Been Created!',
      text: `Your apartment has been created successfully!\n Apartment ID: ${apartmentId}\nPlease keep this ID safe, as it will be used to identify your apartment and add users in the future.`,
      html: `<p><strong>Your apartment has been created successfully!</strong></p>
             <p>Apartment ID: <strong>${apartmentId}</strong></p>
             <p>Please keep this ID safe, as it will be used to identify your apartment and add users in the future.</p>`,
    };

    transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });

    res.status(200).json({
      success: true,
      message: "Apartment created",
      apartmentId: apartmentId,
    });
  } catch (error: any) {
    console.log("Error creating apartment", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default apartmentsRouter;
