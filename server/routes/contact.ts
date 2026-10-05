import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public submission
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    const submission = await prisma.contactSubmission.create({
      data: { fullName, email, phone, subject, message },
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Admin: list all submissions
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { submittedAt: 'desc' },
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get submissions' });
  }
});

// Admin: mark as read
router.put('/:id/read', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

export default router;