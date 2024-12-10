import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "./App.module.css";

const App = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    client: "",
    issue: "",
    deadline: "",
  });
  const [error, setError] = useState("");

  // Fetch tickets
  useEffect(() => {
    axios
      .get("http://localhost:3000/tickets")
      .then((response) => setTickets(response.data))
      .catch((err) => console.error("Error fetching tickets:", err));
  }, []);

  // Update ticket status
  const handleStatusChange = (id: string, newStatus: string) => {
    axios
      .put(`http://localhost:3000/tickets/${id}`, { status: newStatus })
      .then(() => {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === id ? { ...ticket, status: newStatus } : ticket
          )
        );
      })
      .catch((err) => console.error("Error updating ticket status:", err));
  };
  
  const handleDownloadReport = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tickets/report", {
        responseType: "blob", // Handle binary data
      });
  
      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
  
      // Create a link to download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "TicketsReport.xlsx"); // Set the file name
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  const getStatusIcon = (status: string, deadline: string) => {
    const today = new Date();
    const dueDate = new Date(deadline);

    if (status === "closed") {
      return "/status-green.svg";
    } else if (dueDate > today) {
      return "/status-yellow.svg";
    } else {
      return "/status-red.svg";
    }
  };

  // Create a random ticket
  const handleGenerateRandomTicket = () => {
    const randomTicket = {
      client: `Client ${tickets.length + 1}`,
      issue: `Issue ${tickets.length + 1}`,
      status: "open",
      deadline: new Date(
        Date.now() + Math.floor(Math.random() * 10000000)
      ).toISOString(),
    };

    axios
      .post("http://localhost:3000/tickets", randomTicket)
      .then((response) => setTickets([...tickets, response.data]))
      .catch((err) => console.error("Error creating random ticket:", err));
  };

  // Open the create ticket dialog
  const handleOpenDialog = () => {
    setError("");
    setNewTicket({ client: "", issue: "", deadline: "" });
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle input change in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTicket((prevTicket) => ({ ...prevTicket, [name]: value }));
  };

  // Submit new ticket
  const handleCreateTicket = () => {
    const { client, issue, deadline } = newTicket;

    // Validate input
    if (!client || !issue || !deadline) {
      setError("All fields are required.");
      return;
    }

    const newTicketData = {
      client,
      issue,
      status: "open",
      deadline: new Date(deadline).toISOString(),
    };

    axios
      .post("http://localhost:3000/tickets", newTicketData)
      .then((response) => {
        setTickets([...tickets, response.data]);
        setOpenDialog(false);
      })
      .catch((err) => {
        console.error("Error creating new ticket:", err);
        setError("Failed to create ticket.");
      });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            <img
              src="/task-list-icon.svg"
              alt="Task List Icon"
              style={{ marginRight: 8 }}
            />
            Timeline
          </Typography>
        </Grid>
        {tickets.map((ticket) => (
          <Grid item xs={12} key={ticket._id}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{ticket.client}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(ticket.deadline).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {ticket.issue || "No message"}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Switch
                  checked={ticket.status === "closed"}
                  onChange={() =>
                    handleStatusChange(
                      ticket._id,
                      ticket.status === "open" ? "closed" : "open"
                    )
                  }
                  sx={{
                    "& .MuiSwitch-thumb": {
                      backgroundColor: ticket.status === "closed" ? "white" : "green",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: ticket.status === "closed" ? "#2196f3" : "#66bb6a",
                    },
                  }}
                />
                <img
                  src={getStatusIcon(ticket.status, ticket.deadline)}
                  alt="status"
                />
              </Box>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={handleGenerateRandomTicket}
          >
            Create Randomly
          </Button>
          <Button variant="contained" onClick={handleOpenDialog}>
            Create New
          </Button>
          <Button variant="contained" color="primary" onClick={handleDownloadReport}>
            Download Report
          </Button>
        </Grid>
      </Grid>
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Client"
            name="client"
            fullWidth
            value={newTicket.client}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Issue"
            name="issue"
            fullWidth
            value={newTicket.issue}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Deadline"
            name="deadline"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTicket.deadline}
            onChange={handleInputChange}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateTicket} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default App;
