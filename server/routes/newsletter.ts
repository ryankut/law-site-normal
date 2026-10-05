import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public signup
router.post('/', async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const subscriber = await prisma.newsletterSubscriber.create({
      data: { fullName, email },
    });
    res.status(201).json(subscriber);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'This email is already subscribed' });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Admin: list all subscribers
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get subscribers' });
  }
});

router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.newsletterSubscriber.delete({ where: { id } });
    res.json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove subscriber' });
  }
});

export default router;