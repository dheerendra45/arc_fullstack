import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  title: String,
  description: String,
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'closed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Opportunity', opportunitySchema);
