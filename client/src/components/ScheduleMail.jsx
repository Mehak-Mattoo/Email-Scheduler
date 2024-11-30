import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Alert,
  Typography,
  Box,
  TextareaAutosize,
} from "@mui/material";

export default function ScheduleEmail() {
  const [emailDetails, setEmailDetails] = useState({
    to: "",
    subject: "",
    body: "",
    delay: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setEmailDetails({
      ...emailDetails,
      [e.target.name]:
        e.target.name === "delay" ? Number(e.target.value) : e.target.value,
    });
  };

  const AUTH_BACKEND = import.meta.env.VITE_AUTH_BACKEND;

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Request Payload:", emailDetails);

    // Validate if delay is a valid number and positive
    if (isNaN(emailDetails.delay) || emailDetails.delay <= 0) {
      setError(true);
      setMessage("Please enter a valid delay in hours.");
      return;
    }

    try {
      // Call the API
      const response = await axios.post(
        `${AUTH_BACKEND}/schedule-email`,
        emailDetails
      );

      if (response.data.success) {
        setError(false);
        setMessage(response.data.message);
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
      setError(true);
      setMessage("There was an error scheduling the email.");
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f7f7f7",
      }}
    >
      {message && (
        <Alert
          severity={error ? "error" : "success"}
          sx={{ marginTop: 2, textAlign: "center" }}
        >
          {message}
        </Alert>
      )}
      <Typography variant="h5" align="center" gutterBottom>
        Schedule Email
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Recipient's Email"
          name="to"
          value={emailDetails.to}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Subject"
          name="subject"
          value={emailDetails.subject}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Delay (in hours)"
          name="delay"
          value={emailDetails.delay}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextareaAutosize
          name="body"
          placeholder="Email Body"
          value={emailDetails.body}
          onChange={handleChange}
          minRows={5}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 8,
            fontSize: 16,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          required
        ></TextareaAutosize>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ marginTop: 1 }}
        >
          Send Email
        </Button>
      </form>
      <p style={{fontSize:"12px"}}>Made By Mehak Mattoo</p>
    </Box>
  );
}
