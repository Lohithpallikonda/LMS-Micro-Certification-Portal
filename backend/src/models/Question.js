import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }, // index in options array
  },
  { timestamps: true }
);

export const Question = mongoose.model('Question', questionSchema);
