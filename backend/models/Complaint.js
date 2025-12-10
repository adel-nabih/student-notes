import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved'],
      default: 'pending',
    },
    // Link to the user who submitted it
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This links it to your User model
    },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);