// const express = require("express");
// const nodemailer = require("nodemailer");
// const bodyParser = require('body-parser');
// const { Agenda } = require('agenda');

// const app = express();
// app.use(bodyParser.json());
// app.use(express.json());
// require("dotenv").config();
// const cors = require('cors');
// app.use(cors());

// const agenda = new Agenda({ db: { address: process.env.MONGO_DB, collection: 'jobs' } });

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   agenda.define('send email', async (job, done) => {
//     const { to, subject, body } = job.attrs.data;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text: body,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Email sent to:', to);
//       done();
//     } catch (error) {
//       console.error('Error sending email:', error);
//       done(error);
//     }
//   });

//     app.post('/schedule-email', async (req, res) => {
//         const { to, subject, body , delay} = req.body;

//         // Validate request
//         if (!to || !subject || !body|| !delay) {
//           return res.status(400).json({ success: false, message: 'Missing request data' });
//         }
//  // Convert delay in hours to milliseconds
//  const delayInMilliseconds = delay * 60 * 60 * 1000;

//         try {
//             // Schedule the email to be sent after delay
//             await agenda.schedule(`in ${delay} hours`, 'send email', { to, subject, body });

//             res.status(200).json({ success: true, message: `Email scheduled successfully to be sent in ${delay} hour(s)` });
//           } catch (error) {
//             console.error('Error scheduling email:', error);
//             res.status(500).json({ success: false, message: 'Failed to schedule email', error: error.message });
//           }
//         });

//         agenda.start();

//   const PORT = process.env.PORT||8080;
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });

const express = require("express");
const nodemailer = require("nodemailer");
const { Agenda } = require("agenda");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: "GET, POST",
  })
);


const agenda = new Agenda({
  db: { address: process.env.MONGO_DB, collection: "jobs" },
});

console.log("Mongodb connected");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Define email sending job
agenda.define("send email", async (job, done) => {
  const { to, subject, body, sender } = job.attrs.data;

  const mailOptions = {
    from: sender,
    to,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
    done();
  } catch (error) {
    console.error("Error sending email:", error);
    done(error);
  }
});

// API endpoint to schedule email
app.post("/schedule-email", async (req, res) => {
  const { to, subject, body, sender, delay } = req.body;


  if (!to || !subject || !body || typeof delay !== "number" || delay <= 0) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
}

  try {
    // Schedule email with a delay
    const delayInMillis = delay * 60 * 60 * 1000; // Convert delay to milliseconds
    await agenda.schedule(new Date(Date.now() + delayInMillis), "send email", {
      to,
      subject,
      body,
      sender,
    });

    res.status(200).json({
      success: true,
      message: `Email scheduled successfully to be sent in ${delay} hours.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to schedule email",
      error: error.message,
    });
  }
});

// Start Agenda
agenda.start();

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
