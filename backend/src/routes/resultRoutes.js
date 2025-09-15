import express from 'express';
import { auth } from '../middleware/auth.js';
import { Question } from '../models/Question.js';
import { Quiz } from '../models/Quiz.js';
import { Result } from '../models/Result.js';
import { generateCertificate } from '../utils/certificate.js';

const router = express.Router();

// Submit answers
router.post('/quiz/:quizId/submit', auth, async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // [{questionId, selectedOption}]
    if (!Array.isArray(answers) || answers.length === 0) return res.status(400).json({ message: 'No answers provided' });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds }, quizId });
    if (questions.length !== answers.length) return res.status(400).json({ message: 'Mismatch questions' });

    let score = 0;
    const detailed = answers.map(a => {
      const q = questions.find(qi => qi._id.toString() === a.questionId);
      const correct = q.correctAnswer === a.selectedOption;
      if (correct) score += 1;
      return { questionId: q._id, selectedOption: a.selectedOption, correct };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= quiz.passThreshold;

    const result = await Result.create({
      userId: req.user.id,
      quizId,
      score,
      total,
      percentage,
      passed,
      answers: detailed
    });

    res.status(201).json({ resultId: result._id, score, total, percentage, passed });
  } catch (e) { next(e); }
});

// Download certificate
router.get('/:resultId/certificate.pdf', auth, async (req, res, next) => {
  try {
    const { resultId } = req.params;
    const result = await Result.findById(resultId).populate('quizId').populate('userId');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    if (result.userId._id.toString() !== req.user.id.toString()) return res.status(403).json({ message: 'Forbidden' });

    const stream = generateCertificate({
      studentName: result.userId.name,
      quizTitle: result.quizId.title,
      scorePercent: result.percentage,
      passed: result.passed,
      issuedAt: result.createdAt,
      orgName: process.env.CERT_ORG_NAME || 'Certification'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${result._id}.pdf"`);
    stream.pipe(res);
  } catch (e) { next(e); }
});

// Get result details (JSON)
router.get('/:resultId', auth, async (req, res, next) => {
  try {
    const { resultId } = req.params;
    const result = await Result.findById(resultId).populate('quizId').lean();
    if (!result) return res.status(404).json({ message: 'Result not found' });
    if (result.userId.toString() !== req.user.id.toString()) return res.status(403).json({ message: 'Forbidden' });
    res.json({
      id: result._id,
      quizTitle: result.quizId.title,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      passed: result.passed,
      createdAt: result.createdAt
    });
  } catch (e) { next(e); }
});

export default router;
