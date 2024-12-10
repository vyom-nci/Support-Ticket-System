import express from 'express';
import * as XLSX from 'xlsx';
import { Ticket } from '../models/Ticket';

const router = express.Router();

// Retrieve all tickets sorted by deadline
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ deadline: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).send('Error retrieving tickets');
  }
});

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    const { client, issue, status, deadline } = req.body;
    const ticket = new Ticket({ client, issue, status, deadline });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).send('Error creating ticket');
  }
});

// Update a ticket
router.put('/:id', async (req, res) => {
  try {
    const { client, issue, status, deadline } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { client, issue, status, deadline },
      { new: true }
    );
    res.json(updatedTicket);
  } catch (err) {
    res.status(400).send('Error updating ticket');
  }
});

// Generate report
router.get('/report', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    const data = tickets.map((ticket) => ({
      client: ticket.client,
      issue: ticket.issue,
      status: ticket.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets Report');

    const filePath = 'TicketsReport.xlsx';
    XLSX.writeFile(wb, filePath);

    res.download(filePath);
  } catch (err) {
    res.status(500).send('Error generating report');
  }
});

export default router;
