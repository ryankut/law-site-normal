import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Get all active matter types, optionally filtered by practice area (public)
router.get('/', async (req, res) => {
  try {
    const { practiceAreaId } = req.query;

    const matterTypes = await prisma.matterType.findMany({
      where: {
        isActive: true,
        ...(practiceAreaId ? { practiceAreaId: String(practiceAreaId) } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });

    res.json(matterTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get matter types' });
  }
});

// Create matter type (admin only)
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, practiceAreaId, sortOrder } = req.body;

    const matterType = await prisma.matterType.create({
      data: {
        name,
        practiceAreaId: practiceAreaId || null,
        sortOrder: sortOrder || 0,
      },
    });

    res.status(201).json(matterType);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create matter type' });
  }
});

// Update matter type (admin only)
router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const matterType = await prisma.matterType.update({
      where: { id },
      data: req.body,
    });

    res.json(matterType);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update matter type' });
  }
});

// Delete matter type (admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.matterType.delete({ where: { id } });
    res.json({ message: 'Matter type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete matter type' });
  }
});

export default router;