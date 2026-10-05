import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public: get site settings (singleton — returns the first/only row)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.settings.findFirst();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Admin: update settings (upsert — creates the row on first save, updates after)
router.put('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const existing = await prisma.settings.findFirst();

    const settings = existing
      ? await prisma.settings.update({ where: { id: existing.id }, data: req.body })
      : await prisma.settings.create({ data: req.body });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;