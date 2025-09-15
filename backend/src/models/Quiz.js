import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    passThreshold: { type: Number, default: () => parseInt(process.env.PASS_THRESHOLD || '50', 10) },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
