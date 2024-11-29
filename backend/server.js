const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const { Agenda } = require('agenda');


const app = express();
app.use(bodyParser.json()); 
app.use(express.json());
require("dotenv").config();
const cors = require('cors');
app.use(cors());

const agenda = new Agenda({ db: { address: process.env.MONGO_DB, collection: 'jobs' } });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  agenda.define('send email', async (job, done) => {
    const { to, subject, body } = job.attrs.data;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent to:', to);
      done();
    } catch (error) {
      console.error('Error sending email:', error);
      done(error);
    }
  });
  
    app.post('/schedule-email', async (req, res) => {
        const { to, subject, body } = req.body;
      
        // Validate request
        if (!to || !subject || !body) {
          return res.status(400).json({ success: false, message: 'To, subject, and body are required' });
        }

        
        try {
            // Schedule the email to be sent in 1 hour (3600 seconds)
            await agenda.now('send email', { to, subject, body });
        
            res.status(200).json({ success: true, message: 'Email scheduled successfully to be sent in 1 hour' });
          } catch (error) {
            console.error('Error scheduling email:', error);
            res.status(500).json({ success: false, message: 'Failed to schedule email', error: error.message });
          }
        });


   
        agenda.start();
     
  

  const PORT = process.env.PORT||8080;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });