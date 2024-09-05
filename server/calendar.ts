import express from "express";
import queryRunner from "./database/databasepg";
import schedule from "node-schedule";
import transporter from "./enviorments/mailConnect";

const calendarRouter = express.Router();

calendarRouter.get("/:userId", async (req, res) => {
  console.log("eventsRouter.get, userId: ", req.params.userId);
  try {
    const userId = Number(req.params.userId);
    const apartmentId = await getAppartmentId(userId);
    console.log("in get: apartmentId: ", apartmentId);
    const query = `SELECT id, title, description, start_date AS start, end_date AS end FROM eventstable WHERE apartment_id='${apartmentId}'`;
    const result = await queryRunner.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    res.status(500).send("Failed to fetch events");
  }
});

calendarRouter.post("/add", async (req, res) => {
  console.log("event.add,", req.params);
  try {
    const userId = Number(req.body.userId);
    const apartmentId = await getAppartmentId(userId);
    const eventId = (await getLastEventId()) + 1;
    const { title, description, start, end, notifyBeforeHour } = req.body;
    console.log("adddd - eventId: ", eventId);

    const query = `INSERT INTO eventstable (id, apartment_id, title, description, start_date, end_date) VALUES ('${eventId}', '${apartmentId}', '${title}', '${description}', '${start}' , '${end}')`;
    await queryRunner.query(query);

    if (notifyBeforeHour) {
      const eventStartDate = new Date(start);
      const notificationDate = new Date(
        eventStartDate.getTime() - 60 * 60 * 1000
      );

      if (notificationDate > new Date()) {
        schedule.scheduleJob(notificationDate, async () => {
          try {
            const emailsQuery = `SELECT u.email FROM userstable u WHERE u.aptid=${apartmentId}`;
            const emailsResult = await queryRunner.query(emailsQuery);
            const emailAddresses = emailsResult.map((row: any) => row.email);

            const mailOptions = {
              from: "Home.harmony.supp@gmail.com",
              to: emailAddresses.join(", "),
              subject: `Reminder: Upcoming Event - ${title}`,
              text: `This is a reminder that the event "${title}" is scheduled to start at ${eventStartDate.toLocaleString()}. Don't forget!`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Failed to send email:", error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
          } catch (err) {
            console.error("Failed to send reminder email:", err);
          }
        });
      } else {
        console.log("Notification time is in the past, no email will be sent.");
      }
    }

    res.status(200).send("Expense added successfully");
  } catch (err) {
    console.error("Failed to add event:", err);
    res.status(500).send("Failed to add event");
  }
});

calendarRouter.delete("/:id", async (req, res) => {
  console.log("eventsRouter.delete ", req.params.id);
  try {
    const eventId = Number(req.params.id);
    const query = `DELETE FROM eventstable WHERE id ='${eventId}'`;
    const result = await queryRunner.query(query);
    console.log("events result: ", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    res.status(500).send("Failed to fetch events");
  }
});

calendarRouter.post("/edit", async (req, res) => {
  const { id, title, description, start, end } = req.body;
  console.log("Editing event id:", id);

  try {
    const query = `
            UPDATE eventstable 
            SET title = '${title}', description = '${description}', start_date = '${start}',  end_date = '${end}' 
            WHERE id = '${id}'
        `;
    await queryRunner.query(query);

    console.log("Event edited successfully");
    res.status(200).send("Event edited successfully");
  } catch (err) {
    console.error("Failed to edit event:", err);
    res.status(500).send("Failed to edit event");
  }
});

async function getAppartmentId(userId: number): Promise<number> {
  console.log("getAppartmentId userId: ", userId);
  try {
    const query = `SELECT u.aptid FROM userstable u WHERE u.id=${userId}`;
    const result = await queryRunner.query(query);
    console.log("getAppartmentId result: ", result);
    return result[0]?.aptid;
  } catch (err) {
    console.error("Failed to fetch apartment:", err);
    return -1;
  }
}

async function getLastEventId(): Promise<number> {
  console.log("getLastEventId");
  const query = `SELECT MAX(id) FROM eventstable`;
  const result = await queryRunner.query(query);
  console.log("getLastEventId result: ", result);
  return result[0]?.max;
}

export default calendarRouter;
