import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['player', 'organizer', 'admin'], default: 'player' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

export default mongoose.model('User', userSchema);
