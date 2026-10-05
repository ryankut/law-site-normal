import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { practiceAreaId } = req.query;
    const faqs = await prisma.faq.findMany({
      where: {
        isActive: true,
        ...(practiceAreaId ? { practiceAreaId: String(practiceAreaId) } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get FAQs' });
  }
});

router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { question, answer, practiceAreaId, sortOrder } = req.body;
    const faq = await prisma.faq.create({
      data: { question, answer, practiceAreaId: practiceAreaId || null, sortOrder: sortOrder || 0 },
    });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await prisma.faq.update({ where: { id }, data: req.body });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.faq.delete({ where: { id } });
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;