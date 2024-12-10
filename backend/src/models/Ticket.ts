import mongoose, { Document, Schema } from 'mongoose';

interface ITicket extends Document {
  client: string;
  issue: string;
  status: 'open' | 'closed';
  deadline: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    client: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);

export { Ticket };
