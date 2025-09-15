import express from 'express';
import { Quiz } from '../models/Quiz.js';
import { Question } from '../models/Question.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// List active quizzes
router.get('/', async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).select('title description').lean();
    res.json(quizzes);
  } catch (e) { next(e); }
});

// Get quiz questions (auth required)
router.get('/:quizId/questions', auth, async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const questions = await Question.find({ quizId }).select('questionText options').lean();
    res.json({ quiz: { id: quiz._id, title: quiz.title, passThreshold: quiz.passThreshold }, questions });
  } catch (e) { next(e); }
});

export default router;
